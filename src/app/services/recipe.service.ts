import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../interfaces/Recipe";
import { Observable, combineLatest, map, of } from "rxjs";
import { Origin } from "../interfaces/Origin";
import { Page } from "../interfaces/Page";
import { AuthService } from "../auth/services/auth.service";


@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(private http: HttpClient, private authService: AuthService) {}


    private url = "https://proyectoapi-migreydev.onrender.com/recipes"; 
    private urlAdd = "https://proyectoapi-migreydev.onrender.com/recipe";
    private baseUrl = 'https://proyectoapi-migreydev.onrender.com'; 
  

    private urlOrigin = "https://proyectoapi-migreydev.onrender.com/origins"; 

   // Objeto que almacena los ID de las recetas favoritas para cada token de usuario
    private favoritos: { [token: string]: number[] } = {};

    // Metodo para listar recetas paginadas
    listRecipes(page: number, sort: string, asc: boolean): Observable<Page> {
      let params = new HttpParams()
          .set('page', String(page))
          .set('sort', sort)
          .set('asc', asc ? 'ASC' : 'DESC');
  
      return this.http.get<any>(`${this.url}?pageNumber=${page}&sort=${sort}&asc=${asc}`, { params });
  }
  
  // Metodo para agregar un ID de receta a la lista de favoritos asociada al token de usuario.
    agregarAFavoritos(idRecipe: number, token: string): void {
      if (!this.favoritos[token]) {
        this.favoritos[token] = [];
      }
      if (!this.favoritos[token].includes(idRecipe)) {
        this.favoritos[token].push(idRecipe);
        this.actualizarFavoritosEnLocalStorage(token);
      }
    }
    
    // Metodo para eliminar un ID de receta de la lista de favoritos asociada al token de usuario
    eliminarFavoritos(idRecipe: number, token: string): void {
      if (this.favoritos[token]) {
        this.favoritos[token] = this.favoritos[token].filter(id => id !== idRecipe);
        this.actualizarFavoritosEnLocalStorage(token);
      }
    }
  

    // Verifica si una receta esta en favoritos asociada al token del usuario
  esFavorito(idReceta: number, token: string): boolean {
    return this.favoritos[token] && this.favoritos[token].includes(idReceta);
  }
  
    // Obtiene los ID de las recetas favoritas asociadas al token del usuario
  obtenerFavoritos(token: string): number[] {
    return this.favoritos[token] || [];
  }

  // Actualiza el estado de las recetas favoritas en el localStorage
  private actualizarFavoritosEnLocalStorage(token: string): void {
    localStorage.setItem(token, JSON.stringify(this.favoritos[token]));
  }


    //Devuelve un observable que emite un array de origenes de cafe
    getOrigins(): Observable<Origin[]> {
      return this.http.get<Origin[]>(`${this.urlOrigin}`);
    }

    // Devuelve un observable que emite una Receta por su id
    getRecipeById(id: number): Observable<Recipe> {
      // Obtener la URL relativa para obtener la receta por su ID
      const relativeUrl = `recipe/${id}`;
      
      // Llamar al método httpWithAuthorization para realizar la solicitud GET con el token en la cabecera
      return this.httpWithAuthorization('GET', relativeUrl);
    }
    
    
    //Agrega una recta y devuelve un observable que emite la receta creada
    addRecipe(recipe: Recipe): Observable<Recipe> {
      // Obtener la URL relativa para agregar la receta
      const relativeUrl = 'recipe';
      // Llamar al método httpWithAuthorization para realizar la solicitud POST con el token en la cabecera
      return this.httpWithAuthorization('POST', relativeUrl, recipe);
    }

    // Actualiza una receta existente con el ID y devuelve un Observable que emite la receta actualizada
    updateRecipe(id: number, recipe: Recipe): Observable<Recipe> {
      // Obtener la URL relativa para actualizar la receta
      const relativeUrl = `recipe/${id}`;
      
      // Llamar al método httpWithAuthorization para realizar la solicitud PUT con el token en la cabecera
      return this.httpWithAuthorization('PUT', relativeUrl, recipe);
    }

    
    // Elimina una receta existente con el ID
    deleteRecipe(id: number): Observable<any> {
      // URL relativa para eliminar la receta por su ID
      const relativeUrl = `recipe/${id}`;
      
      // Llamar al método httpWithAuthorization para realizar la solicitud DELETE con el token en la cabecera
      return this.httpWithAuthorization('DELETE', relativeUrl);
    }

    
    // Devuelve un Observable que emite el numero total de recetas en el servidor.
    getTotalRecipesCount(): Observable<number> {
      return this.http.get<number>(`${this.url}/count`);
    }
    
    // Metodo para cargar las recetas favoritas asociadas a un token de usuario.
    loadFavoriteRecipes(token: string): Observable<Recipe[]> {
      const favoriteIds = this.obtenerFavoritos(token);
      const requests: Observable<Recipe>[] = [];
      favoriteIds.forEach(id => {
        requests.push(this.getRecipeById(id));
      });
      return combineLatest(requests);
    }


    //Metodo para filtar por metodo
    filterRecipesByMethod(method: string, page: number, sort: string, asc: boolean): Observable<Page> {
      const url = `${this.url}/filter`;
      const params = new HttpParams()
        .set('method', method)
        .set('pageNumber', String(page))
        .set('pageSize', '10') 
        .set('order', sort)
        .set('direction', asc ? 'true' : 'false'); 
      
      return this.http.get<Page>(url, { params });
    }

    //Metodo para filtrar por titulo 
    filterRecipesByTitle(title: string, page: number, sort: string, asc: boolean): Observable<Page>{
      const url = `${this.url}/title`;
      const params = new HttpParams()
        .set('title', title)
        .set('pageNumber', String(page))
        .set('pageSize', '10')
        .set('order', sort)
        .set('direction', asc ? 'true' : 'false');

      return this.http.get<Page>(url, {params});
    }

    // Método para realizar solicitudes HTTP con autorización
    httpWithAuthorization(method: string, relativeUrl: string, body?: any): Observable<any> {
      return this.authService.httpWithAuthorization(method, relativeUrl, body);
  }
}

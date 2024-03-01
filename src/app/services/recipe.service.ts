import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../interfaces/Recipe";
import { Observable, combineLatest, map, of } from "rxjs";
import { Origin } from "../interfaces/Origin";
import { Page } from "../interfaces/Page";


@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(private http: HttpClient) {}


    private url = "http://localhost:8080/recipes"; 
    private urlAdd = "http://localhost:8080/recipe"; 
  

    private urlOrigin = "http://localhost:8080/origins"; 

   
    private favoritos: { [token: string]: number[] } = {};


    listRecipes(page: number, sort: string, asc: boolean): Observable<Page> {
        new HttpParams()
          .set('page', String(page))
          .set('sort', sort)
          .set('asc', asc ? 'ASC' : 'DESC');
        
        
        return this.http.get<any>(`${this.url}?pageNumber=${page}&sort=${sort}&asc=${asc}`)
    }

    agregarAFavoritos(idRecipe: number, token: string): void {
      if (!this.favoritos[token]) {
        this.favoritos[token] = [];
      }
      if (!this.favoritos[token].includes(idRecipe)) {
        this.favoritos[token].push(idRecipe);
        this.actualizarFavoritosEnLocalStorage(token);
      }
    }
    
    eliminarFavoritos(idRecipe: number, token: string): void {
      if (this.favoritos[token]) {
        this.favoritos[token] = this.favoritos[token].filter(id => id !== idRecipe);
        this.actualizarFavoritosEnLocalStorage(token);
      }
    }
  

    // Verifica si una receta está en favoritos asociada al token del usuario
  esFavorito(idReceta: number, token: string): boolean {
    return this.favoritos[token] && this.favoritos[token].includes(idReceta);
  }
  
    // Obtiene los IDs de las recetas favoritas asociadas al token del usuario
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

    //Devuleve un onbervable que emite una Receta por su id
    getRecipeById(id: number): Observable<Recipe> {
      return this.http.get<Recipe>(`http://localhost:8080/recipe/${id}`);
    }
    
    
    //Agrega una recta y devuelve un observable que emite la receta creada
    addRecipe(recipe: Recipe): Observable<Recipe> {
      return this.http.post<Recipe>(this.urlAdd, recipe);
    }

    // Actualiza una receta existente con el id  y devuelve un Observable que emite la receta actualizada
    updateRecipe(id: number, recipe: Recipe): Observable<Recipe> {
      return this.http.put<Recipe>(`http://localhost:8080/recipe/${id}`, recipe);
    }
    
    //elimina una receta existente con el id
    deleteRecipe(id: number): Observable<any> {
      return this.http.delete(`${this.urlAdd}/${id}`);
    }
    
    // Devuelve un Observable que emite el numero total de recetas en el servidor.
    getTotalRecipesCount(): Observable<number> {
      return this.http.get<number>(`${this.url}/count`);
    }
    

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
}

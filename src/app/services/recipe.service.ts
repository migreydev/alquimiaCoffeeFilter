import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../interfaces/Recipe";
import { Observable, map } from "rxjs";
import { Origin } from "../interfaces/Origin";


@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(private http: HttpClient) {}

    private url = "http://localhost:8080/recipes"; 
    private urlAdd = "http://localhost:8080/recipe"; 
  

    private urlOrigin = "http://localhost:8080/origins"; 


    listRecipes(page: number, size: number, sort: string, asc: boolean): Observable<Recipe[]> {
        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sort)
          .set('direction', asc ? 'ASC' : 'DESC');
        
        
        return this.http.get<any>(`${this.url}`, { params }).pipe(
          map(response => response.content)
        );
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
    


    
    


}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/Recipe';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    imports: [FooterComponent, NavBarComponent],
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
    favoriteRecipes: Recipe[] = [];
    recipe!: Recipe;
    token: string | null = null;

    currentFilterMethod: string | null = null;
    
    searchTerm: string = '';


    constructor(private recipeService: RecipeService, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.token = this.authService.getToken();
        if (this.token !== null) {
          this.loadFavoriteRecipesFromLocalStorage();
        }
      }

      loadFavoriteRecipes() {
        // Verificar si hay un token disponible
        if (this.token !== null) {
            // Cargar recetas favoritas asociadas al token del usuario
            this.recipeService.loadFavoriteRecipes(this.token).subscribe({
                next: (recipes: Recipe[]) => {
                    this.favoriteRecipes = recipes;
                },
                error: (error) => {
                    console.error('Error', error);
                }
            });
        } else {
            console.error('Token no encontrado.');
        }
    }
    
    // Añadir receta a favoritos
    agregarAFavoritos(idRecipe: number) {
        if (this.token !== null) {
            this.recipeService.agregarAFavoritos(idRecipe, this.token);
            this.loadFavoriteRecipes(); // Recargar recetas favoritas
        }
    }
    
    // Eliminar receta de favoritos
    eliminarFavoritos(idRecipe: number) {
        if (this.token !== null) {
            this.recipeService.eliminarFavoritos(idRecipe, this.token);
            this.loadFavoriteRecipes(); // Recargar recetas favoritas
        }
    }
    
    // Verificar si una receta es favorita
    esFavorito(idRecipe: number): boolean {
        if (this.token !== null) {
            return this.recipeService.esFavorito(idRecipe, this.token);
        }
        return false; // Si el token es nulo, se devuelve false
    }

    loadFavoriteRecipesFromLocalStorage() {
        if (this.token !== null) {
          const favoritosString = localStorage.getItem(this.token);
          if (favoritosString) {
            this.favoriteRecipes = JSON.parse(favoritosString);
          }
        }
      }

      /*
      loadFilteredRecipes(): void {
        if (this.currentFilterMethod) {
          this.recipeService.filterRecipesByMethod(this.currentFilterMethod)
            .subscribe(page => {
              this.favoriteRecipes = page.content;
            });
        }
      }
      */

      setFilterMethod(method: string): void {
        this.currentFilterMethod = method;
        // Redirige al usuario a la ruta del listado de recetas con el parámetro de filtrado
        this.router.navigate(['/recipes'], { queryParams: { method: method } });

      }
      
      
      onSearch(searchTerm: string): void {
        this.searchTerm = searchTerm;
        // Redirige al usuario a la ruta del listado de recetas con el término de búsqueda
        this.router.navigate(['/recipes'], { queryParams: { method: searchTerm } });
      }
    
}

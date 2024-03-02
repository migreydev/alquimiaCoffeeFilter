import { Component, OnInit } from '@angular/core';
import { Recipe } from '../interfaces/Recipe';
import { RecipeService } from '../services/recipe.service';
import { AuthService } from '../auth/services/auth.service';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
    selector: 'app-favorite-recipes',
    standalone: true,
    templateUrl: './favorite-recipes.component.html',
    imports: [FooterComponent, NavBarComponent]
})

export class FavoriteRecipesComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];
  token: string | null = null;
  isLoading: boolean = false; 
  userName !: string;
  userId !: number;

  constructor(private recipeService: RecipeService, private authService: AuthService) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    if (this.token !== null) {
      this.loadFavoriteRecipes();
    }
  }

  loadFavoriteRecipes(): void {
    if (this.token) {
      const favoriteIds = this.recipeService.obtenerFavoritos(this.token);
      if (favoriteIds && favoriteIds.length > 0) {
        this.recipeService.loadFavoriteRecipes(this.token).subscribe({
          next: (recipes: Recipe[]) => {
            this.favoriteRecipes = recipes;
          },
          error: (error) => {
            console.error('Error loading favorite recipes:', error);
          }
        });
      } else {
        this.favoriteRecipes = [];
      }
    const username = this.authService.getUsername();
    if (username) {
      this.userName = username; 
    }
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

}
import { Component, Input, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/Recipe';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Page } from '../interfaces/Page';
import { AuthService } from '../auth/services/auth.service';
import { SearchComponent } from "../search/search.component";

@Component({
    selector: 'app-lista-recetas',
    standalone: true,
    templateUrl: './lista-recetas.component.html',
    imports: [NavBarComponent, CommonModule, FooterComponent, RouterLink, RouterLinkActive, SearchComponent]
})

export class ListaRecetasComponent implements OnInit {
  
  recipes: Recipe[] = []; //Array para almacenar las recetas
  pageable!: Page;// Variable Page
  numPage = 1; //numero de pagina 
  totalRecipes: number = 0; //total de recetas
  maxPage: number = 0;  //maximo numero de paginas 
  pageSize = 4;
  order = 'id';
  asc = true;

  userRole: string | null = null;
  username: string | null = null;

  currentFilterMethod: string | null = null;
  favoriteRecipes: Recipe[] = [];

  @Input() method: string = '';

  constructor(private recipeService: RecipeService, private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const filteringMethod = params['method'];
      if (filteringMethod) {
        this.currentFilterMethod = filteringMethod;
        this.method = this.currentFilterMethod ?? '';
        this.loadRecipes();
      } else {
        this.loadRecipes();
      }
    });
    this.userRole = this.getUserRole();
  }
  
  

  

  //Metodo para cargar las recetas 
  loadRecipes(): void {
    if (this.method) {
      console.log('Filtering recipes by method:', this.method);
      this.recipeService.filterRecipesByMethod(this.method, this.numPage, this.order, this.asc)
        .subscribe({
          next: (page) => {
            this.recipes = page.content;
            this.pageable = page;
          },
          error: (error) => {
            console.error('Error al cargar las recetas:', error);
          }
        });
    } else {
      console.log('Loading all recipes.');
      this.recipeService.listRecipes(this.numPage, this.order, this.asc)
        .subscribe({
          next: (page) => {
            this.recipes = page.content;
            this.pageable = page;
          },
          error: (error) => {
            console.error('Error al cargar las recetas:', error);
          }
        });
    }
  }
  

  //metodo para incrementar la pagina y avanzar a la siguiente
  nextPage(): void {
    this.numPage++;
    console.log(this.numPage);
    this.loadRecipes();
  }

  //metodo para reducir la pagina y retrocer a la anterior
  prevPage(): void {
    if (this.numPage > 0) {
      this.numPage--;
      console.log(this.numPage);
      this.loadRecipes();
    }
  }

  // Metodo para ir a la primera pagina de recetas
  firstPage(): void {
    if(this.numPage > 2){
      this.numPage = 1;
      this.loadRecipes();
    }
  }
  
  //metodo para ir a la ultima pagina 
  lastPage(): void {
      this.numPage = this.pageable.totalPages; 
      console.log(this.numPage);
      this.loadRecipes();
  }
  
  

  //metodo para eliminar una receta 
  deleteRecipe(id: number) {
    this.recipeService.deleteRecipe(id).subscribe({ //se subscribe al metodo eliminar receta donde se le pasa el id de la receta
      next: (response) => {
        this.loadRecipes();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getUsername(): string | null {
    return this.authService.getUsername();
  }

  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

  agregarAFavoritos(idRecipe: number) {
    const token = this.authService.getToken();
    if (token) {
        this.recipeService.agregarAFavoritos(idRecipe, token);
        this.loadRecipes(); // Recargar recetas después de agregar a favoritos
    } else {
        console.error('Token del usuario no encontrado.');
    }
}

eliminarFavorito(idRecipe: number) {
    const token = this.authService.getToken();
    if (token) {
        this.recipeService.eliminarFavoritos(idRecipe, token);
        this.loadRecipes(); // Recargar recetas después de eliminar de favoritos
    } else {
        console.error('Token del usuario no encontrado.');
    }
}


  
esFavorito(idRecipe: number) {
  const token = this.authService.getToken();
  if (token) {
    return this.recipeService.esFavorito(idRecipe, token); // Proporciona el token como segundo argumento
  } else {
    console.error('Token del usuario no encontrado.');
    return false;
  }
}

  
  getFavoritos() {
    const token = this.authService.getToken();
    if (token) {
      return this.recipeService.obtenerFavoritos(token);
    } else {
      console.error('Token del usuario no encontrado.');
      return [];
    }
  }
  
  pulsarFavorito(idRecipe: number) {
    if (this.esFavorito(idRecipe)) {
      this.eliminarFavorito(idRecipe);
    } else {
      this.agregarAFavoritos(idRecipe);
    }
  }
  

  onSearch(searchTerm: string): void {
    this.method = searchTerm.trim().toLowerCase();
    this.loadRecipes();
  }

}

import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/Recipe';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FooterComponent } from "../../footer/footer.component";
import { RecipeService } from '../../services/recipe.service';
import { DataTablesModule } from 'angular-datatables';
import { SelectTypeComponent } from "../select-type/select-type.component";


@Component({
    selector: 'app-recipes-by-user',
    standalone: true,
    templateUrl: './recipes-by-user.component.html',
    styleUrl: './recipes-by-user.component.css',
    imports: [NavBarComponent, FooterComponent, RouterLink, RouterLinkActive, DataTablesModule, SelectTypeComponent]
})

export class RecipesByUserComponent implements OnInit {

  userRecipes: Recipe[] = [];
  userName !: string;
  userId !: number;
  isAscending: boolean = true;

  @Input() methodRecibe = '';
  currentPage: number = 1;
  totalPages: number = 0;
  recipesPerPage: number = 5;
  paginatedRecipes: Recipe[] = [];
  


  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: this.recipesPerPage,
    processing: true
  };

  constructor(private authService: AuthService, private route: ActivatedRoute, private recipeService: RecipeService) {}
  
  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Obtener el ID de usuario
    this.loadUserRecipes(); // Cargar las recetas del usuario

    if (this.userId > 0) {
        this.authService.getUserRecipes().subscribe({
            next: (recipes: Recipe[]) => {
                this.userRecipes = recipes;// Asignar las recetas del usuario
                this.sortRecipesByTitle(); // Ordenar las recetas por título
                this.calculatePaginationData();
                this.calculatePaginatedRecipes(); // Actualiza las recetas paginadas
            },
            error: (error) => {
                console.error('Error', error);
            }
        });
    } else {
        console.error('Error');
    }

    const username = this.authService.getUsername();
    if (username) {
        this.userName = username; 
    }
}

loadUserRecipes(): void {
    this.authService.getUserRecipes().subscribe({
        next: (recipes: Recipe[]) => {
            this.userRecipes = recipes;
            this.sortRecipesByTitle();
            this.calculatePaginationData();
            this.calculatePaginatedRecipes(); // Actualiza las recetas paginadas
        },
        error: (error) => {
            console.error('Error', error);
        }
    });
}

 // Ordenar las recetas por título
 sortRecipesByTitle(): void {
  this.paginatedRecipes.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    let comparison = 0;

    if (titleA < titleB) {
      if (this.isAscending) {
        comparison = -1;
      } else {
        comparison = 1;
      }
    } else if (titleA > titleB) {
      if (this.isAscending) {
        comparison = 1;
      } else {
        comparison = -1;
      }
    } else {
      comparison = 0;
    }

    return comparison;
  });
  

  this.isAscending = !this.isAscending;
}


//Eliminar receta
deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
        next: () => {
            const recipe = this.userRecipes.find(recipe => recipe.id === id);// Buscar la receta en la lista de recetas del usuario utilizando su ID
            if (recipe) {
                recipe.deleted = 1; //Marca la receta como eliminada 
            }
        },
        error: (error) => {
            console.error(`Error`, error);
        }
    });
}

// Método para calcular las recetas que se mostrarán en la página actual
calculatePaginatedRecipes(): void {
    const startIndex = (this.currentPage - 1) * this.recipesPerPage;
    const endIndex = startIndex + this.recipesPerPage;
    this.paginatedRecipes = this.userRecipes.slice(startIndex, endIndex);
}

calculatePaginationData(): void {
    this.totalPages = Math.ceil(this.userRecipes.length / this.recipesPerPage);
}

firstPage(): void {
    this.currentPage = 1;
    this.calculatePaginatedRecipes();
}

prevPage(): void {
    if (this.currentPage > 1) {
        this.currentPage--;
        this.calculatePaginatedRecipes();
    }
}

nextPage(): void {
    if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.calculatePaginatedRecipes();
    }
}

lastPage(): void {
    this.currentPage = this.totalPages;
    this.calculatePaginatedRecipes();
}

isMethodInPage(method: string): boolean {
  for (let recipe of this.paginatedRecipes) {
    if (recipe.filteringMethod === method) {
      return true;
    }
  }
  return false;
}

}

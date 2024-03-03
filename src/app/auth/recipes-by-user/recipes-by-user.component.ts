import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/Recipe';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FooterComponent } from "../../footer/footer.component";
import { RecipeService } from '../../services/recipe.service';
import { DataTablesModule } from 'angular-datatables';


@Component({
    selector: 'app-recipes-by-user',
    standalone: true,
    templateUrl: './recipes-by-user.component.html',
    imports: [NavBarComponent, FooterComponent, RouterLink, RouterLinkActive, DataTablesModule],
    styleUrl: './recipes-by-user.component.css'
})

export class RecipesByUserComponent implements OnInit {

  userRecipes: Recipe[] = [];
  userName !: string;
  userId !: number;

  dtOptions: any = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true
  };

  constructor(private authService: AuthService, private route: ActivatedRoute, private recipeService: RecipeService) {}
  
  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Obtener el ID de usuario
    this.loadUserRecipes(); // Cargar las recetas del usuario
    
  
    if (this.userId > 0) {
      this.loadUserRecipes();
      this.authService.getUserRecipes().subscribe({
        next: (recipes: Recipe[]) => {
          this.userRecipes = recipes;// Asignar las recetas del usuario
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
      },
      error: (error) => {
        console.error('Error', error);
      }
    });
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
}

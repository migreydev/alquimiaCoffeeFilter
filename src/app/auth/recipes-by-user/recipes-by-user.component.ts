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
    this.userId = this.authService.getUserId();
    this.loadUserRecipes();
    
  
    // Asegúrate de que userId sea un número válido y no sea 0.
    if (this.userId > 0) {
      this.loadUserRecipes();
      this.authService.getUserRecipes().subscribe({
        next: (recipes: Recipe[]) => {
          this.userRecipes = recipes;
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


  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe({
      next: () => {
        const recipe = this.userRecipes.find(recipe => recipe.id === id);
        if (recipe) {
          recipe.deleted = 1;
        }
      },
      error: (error) => {

        console.error(`Error`, error);
      }
    });
  }
}

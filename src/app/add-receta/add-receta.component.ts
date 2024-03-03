import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { Recipe } from '../interfaces/Recipe';
import { RecipeService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Origin } from '../interfaces/Origin';
import { AuthService } from '../auth/services/auth.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-add-receta',
    standalone: true,
    templateUrl: './add-receta.component.html',
    imports: [FooterComponent, NavBarComponent, CommonModule, FormsModule, NgSelectModule],
    styleUrl: './add-receta.component.css'
})
export class AddRecetaComponent implements OnInit {

  origins: Origin[] = []; //array de origenes
  username: string  = "";
  email: string = "";
  idUser: number = 0;
  newRecipe: Recipe = { 
    id: 0,
    userId: 0, 
    userName: '',
    userEmail: '',
    title: '', 
    description: '',
    filteringMethod: '',
    originIds: [], 
    image: '',
    deleted: 0
  };

  successMessage: string = '';
  errorMessage: string = '';


  constructor(private recipeService: RecipeService, private authService: AuthService) {}


  ngOnInit(): void { 
      this.loadOrigins();
      this.newRecipe.userId = this.authService.getUserId() || 0;
      this.newRecipe.userName = this.authService.getUsername() || "";
      this.newRecipe.userEmail = this.authService.getUserEmail() || "";
  }


  //Metodo para cargar los origenes de cafe 
  loadOrigins(): void {
    this.recipeService.getOrigins().subscribe({ //Se subcribe al metodo obtener origenes 
        next: (data) => { //nos devuleve los origenes
          this.origins = data; //se almacena en nuestro array de origenes
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
  }

  //Metodo para guardar receta
  saveRecipe(): void {
    // Asignar detalles del usuario justo antes de guardar la receta
    this.newRecipe.userId = this.authService.getUserId() || 0;
    this.newRecipe.userName = this.authService.getUsername() || "";
    this.newRecipe.userEmail = this.authService.getUserEmail() || "";
  
    if (this.newRecipe.userId && this.newRecipe.title && this.newRecipe.description) {
      this.recipeService.addRecipe(this.newRecipe).subscribe({
        next: (recipe) => {
          this.successMessage = 'Recipe added successfully!';
          this.resetForm(); // Resetea el formulario
        },
        error: (error) => {
          console.error('Error', error);
          this.errorMessage = 'Failed to save the recipe.';
        }
      });
    } else {
      this.errorMessage = 'Required user information is missing.';
    }
  }
  
  
  

    //metodo para resetar los valores del formulario de receta 
    private resetForm(): void {
      this.newRecipe.title = ''; 
      this.newRecipe.description = '';
      this.newRecipe.filteringMethod = '';
      this.newRecipe.originIds = [];
    }

  getUsername(): string | null {
    const user = this.authService.user;
    return user ? user.username : null;
  }

  getEmail(): string | null {
    const user = this.authService.user;
    return user ? user.email : null;
  }


}
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { Recipe } from '../interfaces/Recipe';
import { RecipeService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Origin } from '../interfaces/Origin';
import { AuthService } from '../auth/services/auth.service';

@Component({
    selector: 'app-add-receta',
    standalone: true,
    templateUrl: './add-receta.component.html',
    imports: [FooterComponent, NavBarComponent, CommonModule, FormsModule]
})
export class AddRecetaComponent implements OnInit {
  origins: Origin[] = []; //array de origenes
  username: string  = "";
  email: string = "";
  idUser: number = 0;
  newRecipe: Recipe = { 
      id: 0,
      userId: this.idUser, 
      userName: this.username,
      userEmail: this.email,
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

  //Se ejecuta automaticamente cuando se inicializa el componente y llama al metodo cargar origenes cafe
  ngOnInit(): void { 
      this.loadOrigins();
      this.newRecipe.userId = this.authService.getUserId() || 1;
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
    if (this.newRecipe.userId) { //si el id del usuario es true
      this.recipeService.addRecipe(this.newRecipe).subscribe({ //nos subcribimos al metodo añadir receta
        next: (recipe) => { 
            this.newRecipe = recipe; //la nueva receta se la asociamos a nuestro objeto de receta 
          this.successMessage = 'Recipe added successfully!';
          this.errorMessage = ''; 
          this.resetForm(); //reseteamos los valores del formulario
        },
        error: (error) => {
          console.error('Error', error);
          this.errorMessage = 'Failed to save the recipe.';
          this.successMessage = ''; 
        }
      });
    }
  }
  

    //metodo para resetar los valores del formulario de receta 
  private resetForm(): void {
      this.newRecipe = {
          id: 0,
          userId: 1,
          userName: this.username,
          userEmail: this.email,
          title: '', 
          description: '',
          filteringMethod: '',
          originIds: [], 
          image: '',
          deleted: 0
      };
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
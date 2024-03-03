import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Origin } from '../interfaces/Origin';
import { Recipe } from '../interfaces/Recipe';
import { RecipeService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: 'app-edit-receta',
    standalone: true,
    templateUrl: './edit-receta.component.html',
    imports: [FooterComponent, NavBarComponent, CommonModule, FormsModule, NgSelectModule]
})
export class EditRecetaComponent implements OnInit{

  origins: Origin[] = [];//Array de origenes
  recipeForm: Recipe = { //Objeto de tipo receta 
      id: 0,
      userId: 1, 
      userName: 'Sonnie',
      userEmail: 'sstutte0@gmail.com',
      title: '', 
      description: '',
      filteringMethod: '',
      originIds: [], 
      image: '',
      deleted: 0
  };

  successMessage: string = ''; //mensaje
    errorMessage: string = ''; //mensaje

  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; //convierte el id de la ruta en un numero
      if (id) { //si el id es true
        this.recipeService.getRecipeById(id).subscribe(recipe => { //se llama al metodo de obtener el id de la receta y se subcribe
          //cuando se reciba se almacena en la receta creada anteriomente
          this.recipeForm = recipe; 
        });
      }
    });
    this.loadOrigins(); //carga los origenes del cafe en la receta 
  }
  
  private resetForm(): void { //metodo para reestablecer los valores del formulario de la receta
    this.recipeForm = {
      id: 0,
      userId: 1, 
      userName: '',
      userEmail: '',
      title: '',
      description: '',
      filteringMethod: '',
      originIds: [],
      image: '',
      deleted: 0
    };
  }
  
  //Metodo para guardar la receta
  saveRecipe(): void {
    if (this.recipeForm.id) { //si el id de la receta es true
      this.recipeService.updateRecipe(this.recipeForm.id, this.recipeForm).subscribe({ //se llama al metodo actualizar del servicio y se le pasa el id y la receta
        next: (updatedRecipe) => {
          this.successMessage = 'Recipe updated successfully!';
          this.errorMessage = '';
          this.resetForm(); //Se resetea los valores de la receta
        },
        error: (error) => {
          console.error('Error', error);
          this.errorMessage = 'Failed to update the recipe.';
          this.successMessage = '';
        }
      });
    }
  }
  

  loadOrigins(): void {
    this.recipeService.getOrigins().subscribe({ //se subcribe al servicio para obtener los origenes
      next: (origins) => {
        this.origins = origins; //cuando se obtiene lo asociamos al array de origenes
      },
      error: (error) => {
        console.error('Error', error); // En caso contrario devuelve un error 
      }
    });
  }
  
  





}

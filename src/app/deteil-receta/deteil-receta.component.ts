import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/Recipe';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";
import { Origin } from '../interfaces/Origin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-deteil-receta',
    standalone: true,
    templateUrl: './deteil-receta.component.html',
    imports: [NavBarComponent, FooterComponent, FormsModule, CommonModule]
})
export class DetailRecetaComponent implements OnInit {
  origins: Origin[] = []; //Array de origenes de cafe
  recipe: Recipe = { 
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


  constructor(private route: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {  //Se subscribe al parametro de tura para obtener el id
      const id = +params['id'];  //Obtiene el id y lo convertimos en tipo numero 
      if (id) { //si es true
        this.recipeService.getRecipeById(id).subscribe(recipe => { //Nos subcribimos al metodo obtener receta por id que devolvera una receta
          
          this.recipe = recipe; //Y se la asociamos a nuestra receta 
        });
      }
    });
    this.loadOrigins(); //cargamos los origenes
  }
  

  
  saveRecipe(): void {
    if (this.recipe.id) { //Si es true
      this.recipeService.updateRecipe(this.recipe.id, this.recipe).subscribe({ //se subscribe al metodo actualizar 
        next: (updatedRecipe) => { //valor que emite el observable 
          this.recipe = updatedRecipe; //asociamos la actualizacion a la receta
        },
        error: (error) => {
          console.error('Error', error);
    ;
        }
      });
    }
  }
  

  loadOrigins(): void { //metodo para cargar los origenes del cafe
    this.recipeService.getOrigins().subscribe({ //nos subcribimos en al metodo getOrigins para obtener los origenes
      next: (origins) => { //valor que emite el observable
        this.origins = origins; //asociamos los origenes a nuestro array de origenes
      },
      error: (error) => {
        console.error('Error', error);
      }
    });
  }

  
}

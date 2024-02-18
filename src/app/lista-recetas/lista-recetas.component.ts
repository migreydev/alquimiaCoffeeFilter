import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/Recipe';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-lista-recetas',
  standalone: true,
  imports: [NavBarComponent, CommonModule, FooterComponent, RouterLink, RouterLinkActive],
  templateUrl: './lista-recetas.component.html'
})

export class ListaRecetasComponent implements OnInit {
  
  recipes: Recipe[] = []; //Array para almacenar las recetas
  numPage = 0; //numero de pagina 
  totalRecipes: number = 0; //total de recetas
  maxPage: number = 0;  //maximo numero de paginas 
  pageSize = 4;
  order = 'id';
  asc = true;

  constructor(private recipeService: RecipeService) {}

  //Se inicializa al cargar el componente
  ngOnInit(): void {
    this.calculateMaxPages();
    this.loadRecipes();
  }

  //Metodo para cargar las recetas 
  loadRecipes(): void {
    this.recipeService.listRecipes(this.numPage, this.pageSize, this.order, this.asc).subscribe({
      next: (recipes) => { //Nos devuelve el listado de receta junto al numero de pagina, order....
        this.recipes = recipes;
      },
      error: (error) => {
        console.error('Error al cargar las recetas:', error);
      }
    });
  }

  //metodo para incrementar la pagina y avanzar a la siguiente
  nextPage(): void {
    this.numPage++;
    this.loadRecipes();
  }

  //metodo para reducir la pagina y retrocer a la anterior
  prevPage(): void {
    if (this.numPage > 0) {
      this.numPage--;
      this.loadRecipes();
    }
  }

  //metodo para calcular el numero maximo de paginas 
  calculateMaxPages(): void {
    this.recipeService.getTotalRecipesCount().subscribe({ //nos subscribimos al metodo contador de recetas total
      next: (totalRecipes) => { //nos devuelve el total de recetas
        this.totalRecipes = totalRecipes; //se la asociamos a la variable totalRecipes
        this.maxPage = Math.ceil(this.totalRecipes / this.pageSize) - 1; // calcula el numero maximo de paginas a traves de el total de recetas entre el tamaño de pagina
        this.loadRecipes(); //carga las recetas 
      },
      error: (error) => {
        console.error('Error', error);
      }
    });
  }

  // Metodo para ir a la primera pagina de recetas
  firstPage(): void {
    // Comprueba si el usuario no esta en la primera página
    if (this.numPage > 0) {
      this.numPage = 0;
      this.loadRecipes(); //carga las recetas 
    }
  }
  
  //metodo para ir a la ultima pagina 
  lastPage(): void {
    if (this.numPage < this.maxPage) { // Comprueba si no se esta ya en la ultima pagina
      this.numPage = this.maxPage; //  establece numPage en la última página 
      this.loadRecipes();
    }
  }
  

  orderBy(order: string): void {
    if (this.order === order) {
      this.asc = !this.asc; 
    } else {
      this.order = order; 
      this.asc = true; 
    }
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

}

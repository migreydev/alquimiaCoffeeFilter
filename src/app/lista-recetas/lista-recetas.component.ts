import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/Recipe';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Page } from '../interfaces/Page';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-lista-recetas',
  standalone: true,
  imports: [NavBarComponent, CommonModule, FooterComponent, RouterLink, RouterLinkActive],
  templateUrl: './lista-recetas.component.html'
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

  constructor(private recipeService: RecipeService, private authService: AuthService) {}

  //Se inicializa al cargar el componente
  ngOnInit(): void {
    this.loadRecipes();
    this.userRole = this.getUserRole();
  }

  //Metodo para cargar las recetas 
  loadRecipes(): void {
    this.recipeService.listRecipes(this.numPage, this.order, this.asc).subscribe({
      next: (page) => { //Nos devuelve el listado de receta junto al numero de pagina, order....
        this.recipes = page.content;
        this.pageable = page;
      },
      error: (error) => {
        console.error('Error al cargar las recetas:', error);
      }
    });
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

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/Recipe';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    imports: [FooterComponent, NavBarComponent],
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{


    currentFilterMethod: string | null = null;
    
    searchTerm: string = '';


    constructor(private recipeService: RecipeService, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
  

    }

      // Metodo para establecer el method de filtrado y redirigir al usuario a la ruta del listado
      setFilterMethod(method: string): void {
        this.currentFilterMethod = method;
        // Redirige al usuario a la ruta del listado de recetas con el parametro de filtrado
        this.router.navigate(['/recipes'], { queryParams: { method: method } });

      }
      
      // Metodo para manejar la búsqueda de recetas y redirigir al usuario a la ruta del listado
      onSearch(searchTerm: string): void {
        this.searchTerm = searchTerm;
        // Redirige al usuario a la ruta del listado de recetas con el término de busqueda
        this.router.navigate(['/recipes'], { queryParams: { method: searchTerm } });
      }
    
}

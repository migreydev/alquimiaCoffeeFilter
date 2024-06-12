import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { Origin } from '../interfaces/origin';
import { OriginService } from '../services/origin.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-edit-origin',
    standalone: true,
    templateUrl: './edit-origin.component.html',
    imports: [FooterComponent, NavBarComponent, FormsModule, CommonModule, RouterLink]
})
export class EditOriginComponent implements OnInit{


  constructor(private originService : OriginService,
              private route : ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; //convierte el id de la ruta en un numero
      if (id) { //si el id es true
        this.originService.getOriginById(id).subscribe(origin => { //se llama al metodo de obtener el id del origin y se subcribe
          //cuando se reciba se almacena en el origen creado anteriomente
          this.origin = origin; 
        });
      }
    });
  }

  origin : Origin  = {
    id : 0,
    country: '',
    region: '',
    notesFlavour: '',
  }

  successMessage: string = ''; //mensaje
  errorMessage: string = ''; //mensaje




  //metodo para resetar los valores del formulario de origin 
  private resetForm(): void {
    this.origin.country = ''; 
    this.origin.notesFlavour = '';
    this.origin.region = '';
    this.errorMessage = ''; // Limpiar el mensaje de error
  }

  onSubmit(){
    if (this.origin.country && this.origin.notesFlavour && this.origin.region) {
      this.originService.updateOrigin(this.origin.id, this.origin).subscribe({
        next: (origin) => {
          this.successMessage = 'Origin edit successfully!';
          this.errorMessage = '';
          this.resetForm(); // Resetea el formulario
        },
        error: (error) => {
          console.error('Error', error);
          this.errorMessage = 'Failed to update the origin.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Required user information is missing.';
    }
  }
}



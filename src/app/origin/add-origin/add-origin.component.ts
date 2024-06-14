import { Component, OnInit } from '@angular/core';
import { FooterComponent } from "../../footer/footer.component";
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { OriginService } from '../services/origin.service';
import { Origin } from '../interfaces/origin';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-add-origin',
    standalone: true,
    templateUrl: './add-origin.component.html',
    imports: [FooterComponent, NavBarComponent, FormsModule, CommonModule, RouterLink]
})
export class AddOriginComponent implements OnInit{

  constructor(private originService : OriginService){}

  successMessage: string = ''; //Mensaje exito
  errorMessage: string = ''; //Mensaje error
  successShown: boolean = false;


  ngOnInit(): void {
    
  }

  origin : Omit<Origin, 'id'> = {
    country: '',
    region: '',
    notesFlavour: '',
  }

  onSubmit(form: NgForm){
    if (this.origin.country && this.origin.notesFlavour && this.origin.region) {
      this.originService.addOrigin(this.origin).subscribe({
        next: (origin) => {
          this.successMessage = 'Origin added successfully!';
          this.successShown = true;
          this.resetForm(); // Resetea el formulario
        },
        error: (error) => {
          console.error('Error', error);
          this.errorMessage = 'Failed to save the origin.';
        }
      });
    } else {
      this.errorMessage = 'Required user information is missing.';
      this.markAllAsTouched(form);
    }
  }

  //metodo para resetar los valores del formulario de origin 
  private resetForm(): void {
    this.origin.country = ''; 
    this.origin.notesFlavour = '';
    this.origin.region = '';
    this.errorMessage = ''; // Limpiar el mensaje de error
  }

  // Metodo para marcar todos los campos como tocados para mostrar errores
  private markAllAsTouched(form: NgForm): void {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

}

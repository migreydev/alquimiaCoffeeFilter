import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmailValidatorService {

  emailPattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'; // Patrón para el correo electrónico

  constructor() { }

  // Validador para el correo electronico
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailInput: string = control.value.trim();
      const regex = new RegExp(this.emailPattern);
      if (!regex.test(emailInput)) {
        return { invalidEmail: true };
      }
      return null;
    };
  }
}

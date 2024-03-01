import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  usernamePattern: string = '^[a-zA-Z0-9]*$'; // Patrón para el nombre de usuario (solo letras y números)

  constructor() { }

  // Validador para el nombre de usuario
  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const usernameInput: string = control.value.trim();
      const regex = new RegExp(this.usernamePattern);
      if (!regex.test(usernameInput)) {
        return { invalidUsername: true };
      }
      return null;
    };
  }

  // Validador para verificar si las contraseñas coinciden
  passwordMatchValidator(field1: string, field2: string): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const control2: FormControl = formControl.get(field2) as FormControl;
      const field1Value: string = formControl.get(field1)?.value;
      const field2Value: string = control2?.value;

      if (field1Value !== field2Value) {
        control2.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      if (control2?.errors && control2.hasError('passwordMismatch')) {
        delete control2.errors['passwordMismatch'];
        control2.updateValueAndValidity();
      }

      return null;
    };
  }
}

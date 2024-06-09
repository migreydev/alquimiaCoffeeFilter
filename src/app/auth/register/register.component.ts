import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsService } from '../services/validators.service';
import { EmailValidatorService } from '../services/email-validator.service';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    imports: [NavBarComponent, FooterComponent, ReactiveFormsModule]
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private validatorsService: ValidatorsService, 
    private router: Router,
    private emailValidatorService: EmailValidatorService
  ) {}



  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      // Definir los campos del formulario y sus valores iniciales con validaciones
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, this.emailValidatorService.emailValidator()]], 
      username: ['', [Validators.required, this.validatorsService.usernameValidator()]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: [this.validatorsService.passwordMatchValidator('password', 'confirmPassword')] 
    });
  }

  //Verificacion del formulario
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }
      const { name, email, username, password } = this.registerForm.value;
      const rol = 'user';
      this.authService.register({ name, email, username, password, rol }).subscribe({
        next: () => {
          Swal.fire({
            title: 'Success',
            text: 'User registered successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.message || 'An error occurred while registering the user',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
  }
  

  // Metodo para verificar si un campo de un formulario no es valido
  invalidField(field: string): boolean {
    const control = this.registerForm.get(field);
    if (control) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  private markAllAsTouched() {
    this.registerForm.markAllAsTouched();
  }
  
}
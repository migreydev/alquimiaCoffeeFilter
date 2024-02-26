import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { FooterComponent } from "../../footer/footer.component";
import { AuthService } from '../services/auth.service';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, username, password } = this.registerForm.value;
      const rol = 'user'; // Definir el rol aquí
      this.authService.register({ name, email, username, password, rol }).subscribe(
        () => {
          Swal.fire({
            title: 'Success',
            text: 'User registered successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/auth/login']);
          });
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: error.message || 'An error occurred while registering the user',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
}
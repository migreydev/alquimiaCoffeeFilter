import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, NavBarComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  errorMessage: string = '';
  usernameError: string = '';
  passwordError: string = '';
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { //rglas de validacion
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  //MEtodo para inicio de sesion
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value; // Obtener las credenciales del formulario
      const credentials = { //Las almacenamos en un objeto 
        username: username, 
        password: password
      };
      this.authService.login(credentials).subscribe({
        next: () => {
          this.router.navigate(['/']); 
        },
        error: (error) => {
          if (error.message) {
            this.errorMessage = error.message;
          } else if (error) {
            this.errorMessage = error;
          }
        }
      });
    }
  }

}

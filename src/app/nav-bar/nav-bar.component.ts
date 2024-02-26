import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule,],
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent implements OnInit{
  
  userRole: string | null = null;
  username: string | null = null;

  constructor(private router : Router, private authService: AuthService){}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.username = this.authService.getUsername(); 
}


  getUsername(): string | null {
    const user = this.authService.user;
    return user ? user.username : null;
  }

  getUserRole(): string | null {
    return this.authService.getUserRole();
  }

  logout(): void {
    this.authService.logout();
    // Limpiar cualquier estado relacionado con el usuario después de cerrar sesión
    this.userRole = null;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }


}

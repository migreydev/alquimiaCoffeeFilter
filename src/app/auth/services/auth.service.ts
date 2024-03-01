import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, catchError, map, of, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../interfaces/User";
import { Recipe } from "../../interfaces/Recipe";
import { jwtDecode } from 'jwt-decode';



@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private apiUrlLogin = 'http://localhost:8080/auth/login';
    private apiUrlRegister = 'http://localhost:8080/auth/register';
  
    private _user!: User;
  
    get user(): User {
        return { ...this._user };
    }
  
    constructor(private http: HttpClient, private router: Router) { }
  
    private storageUser(resp: any): void {
        const token = resp.token;
        if (token) {
            localStorage.setItem('token', token);
            console.log('Token almacenado en localStorage:', token);
        } else {
            console.error('El token no está presente en la respuesta:', resp);
        }
        this._user = resp.user;
    }
    
    
  
    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(this.apiUrlLogin, credentials, { responseType: 'text' }).pipe(
          tap((token: string) => {
            this.storageUser({ token });
            console.log('Token:', token);
          }),
          catchError(error => {
            let errorMessage = 'An unexpected failed to login, incorrect username or password';
            if (error.error instanceof ErrorEvent) {
                // Error del lado cliente o de red
                console.error('Error:', error.error.message);
            } else {
                console.error(`Error: ${error.status}`, error.error);
                errorMessage = error.error.message || errorMessage;
            }
            return throwError(() => new Error(errorMessage));
          })
        );
    }
  
    validateToken(): Observable<boolean> {
        const url = `${this.apiUrlLogin}/renew`;
        const headers: HttpHeaders = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');
  
        return this.http.get<any>(url, { headers })
            .pipe(
                map(resp => {
                    this.storageUser(resp);
                    return true;
                }),
                catchError(err => {
                    return of(false);
                })
            );
    }
  
    register(user: any): Observable<any> {
        return this.http.post<any>(this.apiUrlRegister, user);
    }
  
    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }
  
    getToken(): string | null {
        return localStorage.getItem('token');
    }
  
    isLoggedIn(): boolean {
        return !!this.getToken();
    }
  
    private parseJwt(token: string): any {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64));
        } catch (error) {
            return null;
        }
    }

    getUserRole(): string | null {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenPayload = this.parseJwt(token);
            return tokenPayload ? tokenPayload.role : null;
        }
        return null;
    }
    

    getUsername(): string | null {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenPayload = this.parseJwt(token);
            return tokenPayload ? tokenPayload.sub : null;
        }
        return null;
    }

    getUserEmail(): string | null {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenPayload = this.parseJwt(token);
            return tokenPayload ? tokenPayload.email : null;
        }
        return null;
    }

    getUserId(): number {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            return decodedToken.idUser;
        }
        return 0;
    }
    
    
    
    
     // Metodo para obtener las recetas del usuario actual
     getUserRecipes(): Observable<Recipe[]> {
        const userId = this.getUserId(); // Obtener el ID del usuario actual
        return this.http.get<Recipe[]>(`http://localhost:8080/user/${userId}/recipes`);
    }

    

    
    
    
    
    
    
}



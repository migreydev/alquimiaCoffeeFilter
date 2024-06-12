import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Origin } from '../interfaces/origin';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OriginService {

constructor(private http : HttpClient, private authService: AuthService) { }

  private urlOrigin = 'https://proyectoapi-migreydev.onrender.com/origins';
  private baseUrl = 'https://proyectoapi-migreydev.onrender.com'; 

  // Método para realizar solicitudes HTTP con autorización
  httpWithAuthorization(method: string, relativeUrl: string, body?: any): Observable<any> {
    return this.authService.httpWithAuthorization(method, relativeUrl, body);
}

  getOrigins(): Observable<Origin[]>{
    return this.http.get<Origin[]>(this.urlOrigin);
  }

   // Devuelve un observable que emite un Origin por su id
  getOriginById(id: number): Observable<Origin> {
    // Obtener la URL relativa para obtener la receta por su ID
    const relativeUrl = `origin/${id}`;
    
    // Llamar al método httpWithAuthorization para realizar la solicitud GET con el token en la cabecera
    return this.httpWithAuthorization('GET', relativeUrl);
  }

  addOrigin(origin: Omit<Origin, 'id'>): Observable<Origin> {
    // Obtener la URL relativa para agregar la receta
    const relativeUrl = 'origin';
    // Llamar al método httpWithAuthorization para realizar la solicitud POST con el token en la cabecera
    return this.httpWithAuthorization('POST', relativeUrl, origin);
  }

  // Actualiza un origin existente con el ID y devuelve un Observable que emite el origen actualizado
  updateOrigin(id: number, origin: Origin): Observable<Origin> {
    // Obtener la URL relativa para actualizar el origin
    const relativeUrl = `origin/${id}`;
    
    // Llamar al método httpWithAuthorization para realizar la solicitud PUT con el token en la cabecera
    return this.httpWithAuthorization('PUT', relativeUrl, origin);
  }

  // Elimina un origen existente con el ID
  deleteOrigin(id: number): Observable<any> {
    // URL relativa para eliminar el origen por su ID
    const relativeUrl = `origin/${id}`;
    
    // Llamar al método httpWithAuthorization para realizar la solicitud DELETE con el token en la cabecera
    return this.httpWithAuthorization('DELETE', relativeUrl);
  }

}

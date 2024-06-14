import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidateUsernameService implements AsyncValidator {

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;

    return this.http.get<any[]>(`https://proyectoapi-migreydev.onrender.com/users/username/${username}`)
      .pipe(
        map(resp => (resp.length === 0 ? null : { usernameTaken: true }))
      );
  }
}

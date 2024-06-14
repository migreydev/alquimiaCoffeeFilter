import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidateEmailService implements AsyncValidator {

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    
    return this.http.get<any[]>(`https://proyectoapi-migreydev.onrender.com/users/email/${email}`)
    .pipe(
      delay(3000),
      map( resp => {
        return (resp.length === 0) ? null : { emailTaken: true}
      })

    )
    
    
  }
}

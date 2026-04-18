import { Injectable } from '@angular/core';
import { Auth } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private logUrl = "http://127.0.0.1:8000/api/login"
    constructor(private http : HttpClient){}

    login(username: string , password:string){
      return this.http.post<Auth>(`${this.logUrl}/` ,{
        username, password
      } ).pipe(
        tap(res => {
          localStorage.setItem('access' , res.access);
          localStorage.setItem('refresh' , res.refresh);
        })
      )
    }
}

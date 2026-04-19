import { Injectable } from '@angular/core';
import { Auth } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';
import { RegisterResponse } from '../models/register.mode';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private logUrl = "http://127.0.0.1:8000/api/login"
    private registerUrl = "http://127.0.0.1:8000/api/register"
    private profileSubject = new BehaviorSubject<User | null>(null);
    profile$ = this.profileSubject.asObservable();
    constructor(private http : HttpClient){}


    logout(){
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      this.clearProfile();
    }
    login(username: string , password:string){
      return this.http.post<Auth>(`${this.logUrl}/` ,{
        username, password
      } ).pipe(
        tap(res => {
          localStorage.setItem('access' , res.access);
          localStorage.setItem('refresh' , res.refresh);
        }),
      )
    }
    register(username : string , first_name: string , last_name : string , email : string , password : string){
      return this.http.post<RegisterResponse>(`${this.registerUrl}/`,{
        username , first_name , last_name , email,password
      });
    }

    isLoggedIn() : boolean{
      const token = localStorage.getItem('access');
      if (!token) return false;

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        
        if (isExpired) {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          return false;
        }
        return true;
      }catch {
        return false;
      }
    }
    getToken() : string | null{
      return localStorage.getItem('access');
    }
    getProfile(){
      console.log("i'm in getProfile")
      return this.http.get<User>(`http://127.0.0.1:8000/api/profile/`).pipe(
        tap(profile => this.profileSubject.next(profile))
      );
    }
    clearProfile(){
      this.profileSubject.next(null);
    }
}

import { Injectable } from '@angular/core';
import { Auth } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap } from 'rxjs';
import { RegisterResponse } from '../models/register.mode';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private apiUrl = "http://127.0.0.1:8000/api"
    private logUrl = "http://127.0.0.1:8000/api/login"
    private registerUrl = "http://127.0.0.1:8000/api/register"
    private profileSubject = new BehaviorSubject<User | null>(null);
    profile$ = this.profileSubject.asObservable();
    profilePhotot : string | null = "";
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
    getProfile(): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/profile/`).pipe(
        tap(user => this.profileSubject.next(user))
      );
    }



    updateProfile(data: Partial<User>): Observable<User> {
      return this.http.patch<User>(`${this.apiUrl}/profile/`, {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        telegram: data.telegram,
        email: data.email
      });
    }

  uploadAvatar(file: File): Observable<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatar_url: string }>(`${this.apiUrl}/profile/avatar/`, formData);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/change-password/`, {
      old_password: oldPassword,
      new_password: newPassword
    });
  }

  checkUsername(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/check-username/?username=${username}`);
  }

  updateUsername(username: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile/`, { username });
  }

  getProfileById(id : number) : Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/profile/${id}`)
  }
  clearProfile(){
    this.profileSubject.next(null);
  }
}

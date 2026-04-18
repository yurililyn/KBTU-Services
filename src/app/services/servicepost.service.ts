import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicePost } from '../models/servicepost.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServicepostService {
    private apiUrl = "http://127.0.0.1:8000/api/services";
    constructor(private http : HttpClient){}
    getAll() : Observable<ServicePost[]>{
      return this.http.get<ServicePost[]>(`${this.apiUrl}/`);
    }
}

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


    getByAuthor(id : number): Observable<ServicePost[]>{
      return this.http.get<ServicePost[]>(`${this.apiUrl}/?categoyr=${id}`)
    }


    delete(id: number) {
      return this.http.delete(`${this.apiUrl}/${id}/`);
    }
    update(service: ServicePost) {
    return this.http.patch<ServicePost>(`${this.apiUrl}/${service.id}/`, {
      title: service.title,
      description: service.description,
      price: service.price,
      category: service.category
    });
  }
}

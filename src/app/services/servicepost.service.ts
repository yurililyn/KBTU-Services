import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicePost } from '../models/servicepost.model';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
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
      return this.http.get<ServicePost[]>(`${this.apiUrl}/?author=${id}`)
    }
    getById(id: number) : Observable<ServicePost>{
      return this.http.get<ServicePost>(`${this.apiUrl}/${id}`)
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

    search(query: string = '', category: number | null = null, ordering: string = ''): Observable<ServicePost[]> {
      let params = new HttpParams();
      if (query) params = params.set('search', query);
      if (category) params = params.set('category', category.toString());
      if (ordering) params = params.set('ordering', ordering);
      return this.http.get<ServicePost[]>(`${this.apiUrl}/`, { params });
    }


    create(data: { title: string, description: string, price: number, category: number | null }) {
      return this.http.post<ServicePost>(`${this.apiUrl}/`, data);
    }
}

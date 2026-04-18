import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
    private apiUrl = "http://127.0.0.1:8000/api/categories";
    constructor(private http :HttpClient){}
    getAll() : Observable<Category[]>{
      return this.http.get<Category[]>(`${this.apiUrl}/`);
    }
}

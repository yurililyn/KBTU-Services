import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = "http://127.0.0.1:8000/api/orders";
  constructor(private http : HttpClient){}


  getAll() : Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/`);
  }

  getByAuthor(id: number): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/?customer${id}/`);
  }

  getRequested(id: number): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/?customer${id}/`);
  }


  delete(id: number){
    alert("i'm here")
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
}

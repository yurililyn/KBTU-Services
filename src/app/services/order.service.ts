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
    return this.http.get<Order[]>(`${this.apiUrl}/?customer=${id}`);
  }

  getRequested(id: number): Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiUrl}/?service__author=${id}`);
  }


  delete(id: number){
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }
  updateStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/`, { status });
  }

  createOrder(serviceId: number, message: string) {
    const body = {
      service: serviceId,
      message: message
    };

    return this.http.post(`${this.apiUrl}/`, body);
  }
}

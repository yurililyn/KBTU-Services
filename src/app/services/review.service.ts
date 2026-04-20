import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private apiUrl = "http://127.0.0.1:8000/api"
  constructor(private http : HttpClient){}
  submitReview(serviceId: number, data: { score: number, text: string }): Observable<Review>{
    return this.http.post<Review>(`${this.apiUrl}/services/${serviceId}/review/`, data);
  }

  getByServiceId(serviceId : number) : Observable<Review[]>{
    return this.http.get<Review[]>(`${this.apiUrl}/services/${serviceId}/review/`);
  }
}

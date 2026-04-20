import { Component, OnInit, signal, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicepostService } from '../../services/servicepost.service';
import { HttpClient } from '@angular/common/http'; // Для отправки заказа (или создай OrderService)
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ChangeDetectorRef } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { ReviewcardComponent } from "../reviewcard.component/reviewcard.component";
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewcardComponent],
  templateUrl: './servicepostcmain.component.html',
  styleUrl: './servicepostcmain.component.css'
})
export class ServicePostMainComponent implements OnInit {
  service = signal<any>(null);
  isLoading = signal(true);
  currentUser = signal<User | null>(null);
  // Состояние заказа
  showOrderPopup = signal(false);
  orderMessage = signal('');
  isSubmitting = signal(false);
  reviews : Review[] = [];
  constructor(
    private route: ActivatedRoute,
    private serviceService: ServicepostService,
    private reviewService : ReviewService,
    private http: HttpClient ,
    private ordService: OrderService,
    private cdr : ChangeDetectorRef,
    private location : Location,
    private router: Router,
    private auth : AuthService
  ) {
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id) {
      this.serviceService.getById(id).subscribe(data => {
        this.service.set(data);
        this.isLoading.set(false);
        this.cdr.detectChanges();
      });

      // 2. Загружаем все отзывы для этого сервиса
      this.reviewService.getByServiceId(id).subscribe(reviewsData => {
        this.reviews = reviewsData;
      });
    }
  }

  openOrder() {
    this.showOrderPopup.set(true);
  }

  closeOrder() {
    this.showOrderPopup.set(false);
    this.orderMessage.set('');
  }

  submitOrder() {
    if (!this.orderMessage().trim()) return;

    this.isSubmitting.set(true);
    const payload = {
      service: this.service().id,
      message: this.orderMessage()
    };

    // Замени URL на свой эндпоинт заказов
    this.ordService.createOrder(payload.service , payload.message).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeOrder();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        alert('Error creating order');
      }
    });
  }



  getBack(){
    this.location.back();
  }
}
import { Component, OnInit } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ServicepostcardComponent } from '../servicepostcard.component/servicepostcard.component';
import { OrdercardComponent } from '../ordercard.component/ordercard.component';
import { ServicepostService } from '../../services/servicepost.service';
import { OrderService } from '../../services/order.service';
import { ServicePost } from '../../models/servicepost.model';
import { forkJoin } from 'rxjs';
import { Order } from '../../models/order.model';
import { ChangeDetectorRef } from '@angular/core';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { OrdercardrequestedComponent } from '../ordercardrequested.component/ordercardrequested.component';
import { ReviewService } from '../../services/review.service';
@Component({
  selector: 'app-profile',
  imports: [OrdercardrequestedComponent,  CommonModule, ServicepostcardComponent, OrdercardComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profile$: Observable<User | null>;
  activeTab: string = 'requests';
  services : ServicePost[] = [];
  orders: Order[] = [];
  requestedOrders: Order[] = [];
  categories: Category[] = [];
  showCreatePopup = false;
  newService = { title: '', description: '', price: 0, category: null as number | null };
  isCreating = false;
  showReviewPopup = false;
  isSubmittingReview = false;
  selectedOrderForReview: Order | null = null;
  reviewData = { score: 5, text: '' };
  reviewMessage = { text: '', type: '' };
  constructor(private auth: AuthService , private serpostService : ServicepostService,
    private ordService : OrderService, private cdr: ChangeDetectorRef, private categoryService : CategoryService,
    private revService: ReviewService
  ) {
    this.profile$ = this.auth.profile$;
  }

  ngOnInit() {
    this.auth.getProfile().pipe(
      switchMap(user => forkJoin({
        services: this.serpostService.getByAuthor(user.id),
        orders: this.ordService.getByAuthor(user.id),
        requestedOrders: this.ordService.getRequested(user.id)
      }))
    ).subscribe(result => {
      this.services = result.services;
      this.orders = result.orders;
      this.requestedOrders = result.requestedOrders;
      this.cdr.detectChanges();
    });
    this.categoryService.getAll().subscribe(cats => {
    this.categories = cats;
    this.cdr.detectChanges();
});
}


  getAverageRating(): number {
    if (this.services.length === 0) return 0;
    const total = this.services.reduce((sum, s) => sum + s.average_rating, 0);
    return +(total / this.services.length).toFixed(1);
  }
  setTab(tab: string) {
    this.activeTab = tab;
  }


  onServiceDeleted(id: number) {
    this.serpostService.delete(id).subscribe(() => {
      this.services = this.services.filter(s => s.id !== id);
      this.cdr.detectChanges();
    });
  }

  onServiceUpdated(updated: ServicePost) {
    this.serpostService.update(updated).subscribe(result => {
      this.services = this.services.map(s => s.id === result.id ? result : s);
      this.cdr.detectChanges();
    });
  }


  onOrderDelete(id: number){
    this.ordService.delete(id).subscribe(() =>{
      this.orders = this.orders.filter(s=>s.id != id);
      this.cdr.detectChanges();
    })
  }



  openCreatePopup() {
    this.newService = { title: '', description: '', price: 0, category: null };
    this.showCreatePopup = true;
  }

  closeCreatePopup() {
    this.showCreatePopup = false;
  }

  onServiceCreate() {
    if (!this.newService.title || !this.newService.price || !this.newService.category) return;
    if (this.isCreating) return;
    
    this.isCreating = true;
    this.serpostService.create(this.newService).subscribe({
      next: (created) => {
        this.services = [created, ...this.services];
        this.showCreatePopup = false;
        this.isCreating = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isCreating = false;
        this.cdr.detectChanges();
      }
  });
}
  onStatusChanged(event: any) {
    this.ordService.updateStatus(event.id, event.status).subscribe((updated: any) => {
    this.requestedOrders = this.requestedOrders.map(o => o.id === updated.id ? updated : o);
    this.cdr.detectChanges();
    });
  }
  openReviewPopup(order: Order) {
    this.selectedOrderForReview = order;
    this.reviewData = { score: 5, text: '' }; // Сброс формы
    this.reviewMessage = { text: '', type: '' }; // Сброс сообщений
    this.showReviewPopup = true;
    this.cdr.detectChanges();
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
    this.selectedOrderForReview = null;
  }

  onSubmitReview() {
    if (!this.selectedOrderForReview) return;
    
    // Валидация оценки
    if (this.reviewData.score < 1 || this.reviewData.score > 5) {
      this.reviewMessage = { text: 'Оценка должна быть от 1 до 5', type: 'error' };
      return;
    }

    this.isSubmittingReview = true;
    this.reviewMessage = { text: '', type: '' };

    // Предполагается, что в Order есть ID услуги (например, order.service)
    // Замени `this.selectedOrderForReview.service` на правильное поле из твоей модели
    const serviceId = (this.selectedOrderForReview as Order).service;
    const orderId = (this.selectedOrderForReview as Order).id;
    // Вызов сервиса (замени на свой)
    this.revService.submitReview(serviceId, this.reviewData).subscribe({
      next: () => {
        this.isSubmittingReview = false;
        this.reviewMessage = { text: 'Отзыв успешно сохранен!', type: 'success' };
        this.cdr.detectChanges();
        setTimeout(() => 1000);
        this.closeReviewPopup();
        this.ordService.delete(orderId).subscribe(() =>{
          this.orders = this.orders.filter(s=>s.id != orderId);
          this.cdr.detectChanges();
        })
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmittingReview = false;
        console.log(err);
        // Показываем ошибку от бэкенда (например, если пытается оценить свою услугу)
        this.reviewMessage = { 
          text: err.error?.detail || 'Произошла ошибка при отправке.', 
          type: 'error' 
        };
        this.cdr.detectChanges();
      }
    });
  }
}
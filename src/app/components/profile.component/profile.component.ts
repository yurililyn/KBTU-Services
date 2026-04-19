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
@Component({
  selector: 'app-profile',
  imports: [CommonModule, ServicepostcardComponent, OrdercardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profile$: Observable<User | null>;
  activeTab: string = 'requests';
  services : ServicePost[] = [];
  orders: Order[] = [];
  requestedOrders: Order[] = [];

  constructor(private auth: AuthService , private serpostService : ServicepostService,
    private ordService : OrderService, private cdr: ChangeDetectorRef
  ) {
    this.profile$ = this.auth.profile$;
  }

  ngOnInit() {
  this.auth.getProfile().pipe(
    switchMap(user => forkJoin({
      services: this.serpostService.getByAuthor(user.id),
      orders: this.ordService.getAll(),
      requestedOrders: this.ordService.getRequested(user.id)
    }))
  ).subscribe(result => {
    this.services = result.services;
    this.orders = result.orders;
    this.requestedOrders = result.requestedOrders;
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
}
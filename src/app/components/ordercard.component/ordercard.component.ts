import { Component, input, output } from '@angular/core';
import { Order } from '../../models/order.model';
import { CommonModule, DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-ordercard',
  imports: [DatePipe, NgClass, CommonModule],
  templateUrl: './ordercard.component.html',
  styleUrl: './ordercard.component.css',
})
export class OrdercardComponent {
  order = input.required<Order>();
  deleted = output<number>();
  reviewRequested = output<Order>();

  onDelete() {
    this.deleted.emit(this.order().id);
  }

  onReview() {
    this.reviewRequested.emit(this.order());
  }
}

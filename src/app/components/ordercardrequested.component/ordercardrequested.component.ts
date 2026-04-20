import { Component, input, output } from '@angular/core';
import { Order } from '../../models/order.model';
import { CommonModule, DatePipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ordercardrequested',
  imports: [DatePipe, NgClass, NgIf, FormsModule, CommonModule],
  templateUrl: './ordercardrequested.component.html',
  styleUrl: './ordercardrequested.component.css',
})
export class OrdercardrequestedComponent {
  order = input.required<Order>();
  statusChanged = output<{ id: number; status: string }>();

  showStatusPopup = false;
  selectedStatus = '';

  readonly statusOptions = ['pending', 'accepted', 'completed'];

  openPopup() {
    this.selectedStatus = this.order().status;
    this.showStatusPopup = true;
  }

  closePopup() {
    this.showStatusPopup = false;
  }

  applyStatus() {
    if (this.selectedStatus && this.selectedStatus !== this.order().status) {
      this.statusChanged.emit({ id: this.order().id, status: this.selectedStatus });
    }
    this.closePopup();
  }
}

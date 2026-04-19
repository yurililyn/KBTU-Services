import { Component ,input, output} from '@angular/core';
import { Order } from '../../models/order.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ordercard',
  imports: [DatePipe],
  templateUrl: './ordercard.component.html',
  styleUrl: './ordercard.component.css',
})
export class OrdercardComponent {
  order = input.required<Order>();
  deleted = output<number>();

  onDelete(){
    alert("hello");
    this.deleted.emit(this.order().id);
  }
}

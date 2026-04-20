import { Component, input } from '@angular/core';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviewcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviewcard.component.html',
  styleUrl: './reviewcard.component.css'
})
export class ReviewcardComponent {
  review = input.required<Review>();
  avatar = input<string | null>(null);

  getInitial(): string {
    return this.review().username?.charAt(0).toUpperCase() || '?';
  }
  getDate(dateStr: string): Date {
    return new Date(dateStr);
  }
}

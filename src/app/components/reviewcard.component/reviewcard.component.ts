import { Component } from '@angular/core';
import { input } from '@angular/core';
import { Review } from '../../models/review.model';
import { CommonModule, DatePipe } from '@angular/common';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-reviewcard',
  imports: [FormsModule, CommonModule],
  templateUrl: './reviewcard.component.html',
  styleUrl: './reviewcard.component.css',
})
export class ReviewcardComponent {
    review = input.required<Review>();

}

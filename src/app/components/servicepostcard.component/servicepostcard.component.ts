import { Component, input, output } from '@angular/core';
import { ServicePost } from '../../models/servicepost.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-servicepostcard',
  imports: [CommonModule, FormsModule],
  templateUrl: './servicepostcard.component.html',
  styleUrl: './servicepostcard.component.css',
})
export class ServicepostcardComponent {
  service = input.required<ServicePost>();
  deleted = output<number>();
  updated = output<ServicePost>();

  showEditPopup = false;
  editData: Partial<ServicePost> = {};

  openEdit() {
    this.editData = { ...this.service() };
    this.showEditPopup = true;
  }

  closeEdit() {
    this.showEditPopup = false;
  }

  saveEdit() {
    this.updated.emit(this.editData as ServicePost);
    this.showEditPopup = false;
  }

  onDelete() {
    this.deleted.emit(this.service().id);
  }
}
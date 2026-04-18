import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { ServicePost } from '../../models/servicepost.model';
import { ServicepostService } from '../../services/servicepost.service';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-main.component',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  categories$: Observable<Category[]>;
  services$: Observable<ServicePost[]>;
  
  constructor(
    private catService: CategoryService, 
    private serposService: ServicepostService
  ) {
    this.categories$ = this.catService.getAll();
    this.services$ = this.serposService.getAll();
  }
}

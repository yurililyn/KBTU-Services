import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { ServicePost } from '../../models/servicepost.model';
import { ServicepostService } from '../../services/servicepost.service';
import { Observable, of } from 'rxjs';
import { RouterLink , Router} from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
@Component({
  selector: 'app-main.component',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  categories$: Observable<Category[]>;
  services$: Observable<ServicePost[]>;
  
  
  searchQuery = '';

  constructor(
    private catService: CategoryService, 
    private serposService: ServicepostService,
    private router : Router
  ) {
    this.categories$ = this.catService.getAll();
    this.services$ = this.serposService.getAll().pipe(
    map(services => services.sort((a, b) => b.average_rating - a.average_rating))
    );
  }


  onSearch() {
    this.router.navigate(['/search/'], {
      queryParams: { search: this.searchQuery }
    });
  }

  onCategory(categoryId: number) {
    this.router.navigate(['/search/'], {
      queryParams: { category: categoryId }
    });
  }

  onViewAll() {
    this.router.navigate(['/search/']);
  }


  goToService(id :number){
    this.router.navigate(["/service" , id])
  }
}

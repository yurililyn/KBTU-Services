import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicepostService } from '../../services/servicepost.service';
import { ServicePost } from '../../models/servicepost.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  services: ServicePost[] = [];
  searchQuery = '';
  selectedOrdering = "";
  selectedCategory: number | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serpostService: ServicepostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] ? +params['category'] : null;
      this.load();
    });
  }

  load() {
    this.isLoading = true;
    this.serpostService.search(this.searchQuery, this.selectedCategory, this.selectedOrdering).subscribe(result => {
    this.services = result;
    this.isLoading = false;
    this.cdr.detectChanges();
    });
  }
  onOrderingChange(ordering: string) {
    this.selectedOrdering = ordering;
    this.load();
  }

  onSearch() {
    this.router.navigate(['/search'], {
      queryParams: {
        search: this.searchQuery,
        category: this.selectedCategory
      }
    });
  }
}
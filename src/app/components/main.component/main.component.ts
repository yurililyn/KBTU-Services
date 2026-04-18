import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { CommonModule } from '@angular/common';
import { ServicePost } from '../../models/servicepost.model';
import { ServicepostService } from '../../services/servicepost.service';

@Component({
  selector: 'app-main.component',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  constructor(private catService : CategoryService, private serposService : ServicepostService){}
  categories : Category[] = [];
  services : ServicePost[] = [];
  ngOnInit(){
    this.catService.getAll().subscribe(data=>{
      this.categories = data;
    })
    this.serposService.getAll().subscribe(data =>{
      this.services = data;
    })
  }
}

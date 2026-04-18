import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {

  services: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/services/')
      .subscribe((data: any) => {
        this.services = data;
      });
  }
}
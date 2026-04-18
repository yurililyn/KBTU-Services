import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('kbtu-services');
  services: any[] = [];

constructor(private http: HttpClient) {}

ngOnInit() {
  this.http.get('http://127.0.0.1:8000/api/services/')
    .subscribe((data: any) => {
      this.services = data;
    });
}
}

import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private auth : AuthService, private router : Router){}
  
  get isAuthPage(): boolean{
    return this.router.url == '/login' || this.router.url == '/registration';
  }
  logout(){
    this.auth.logout();
    this.router.navigate(['/login'])
  }
}

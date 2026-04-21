import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
    constructor(private router : Router) {}
    get isAuthPage(): boolean{
    return this.router.url == '/login' || this.router.url == '/registration';
  }
  openTelegram(){
    window.open("https://t.me/yurililyn");
  }
  openInstagram(){
    window.open("https://www.instagram.com/konyuktor/");
  }
  openEmail(){
    window.open(`mailto:a_guchshin@kbtu.kz`, '_blank');
  }
}

import { Routes } from '@angular/router';
import { MainComponent } from './components/main.component/main.component';
import { LoginComponent } from './components/login.component/login.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "main",
        component: MainComponent
    }
];

import { Routes } from '@angular/router';
import { MainComponent } from './components/main.component/main.component';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/registration.component/registration.component';
import { authGuard } from './auth-guard';
import { profileGuard } from './profile-guard';
import { ProfileComponent } from './components/profile.component/profile.component';
import { SearchComponent } from './components/search/search.component';
export const routes: Routes = [
    {
        path: "",
        redirectTo: "main",
        pathMatch: "full"
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [profileGuard]
    },
    {
        path: "main",
        component: MainComponent,
        canActivate: [authGuard]
    },
    {
        path: "registration",
        component: RegisterComponent,
        canActivate: [profileGuard]
    },
    {
        path: "profile",
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: "search",
        component: SearchComponent,
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: '/main'
    },
    
];

import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { LoginGuardService } from './guards/login-guard.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  {
    path: 'registration',
    component: RegistrationPageComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [LoginGuardService],
  },
  {
    path: 'todos',
    component: MainPageComponent,
    canActivate: [AuthGuardService],
  },
];

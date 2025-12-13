import { Routes } from '@angular/router';
import { LoginGuardService } from './guards/login-guard.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { RootPages, SidebarItems } from './interfaces/enums';

export const routes: Routes = [
  { path: '', redirectTo: RootPages.MAIN, pathMatch: 'full' },
  {
    path: RootPages.REGISTRATION,
    loadComponent: () =>
      import('./pages/registration-page/registration-page.component').then(
        (m) => m.RegistrationPageComponent,
      ),
    canActivate: [LoginGuardService],
  },
  {
    path: RootPages.LOGIN,
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
    canActivate: [LoginGuardService],
  },
  {
    path: RootPages.MAIN,
    loadComponent: () =>
      import('./pages/main-page/main-page.component').then(
        (m) => m.MainPageComponent,
      ),
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: SidebarItems.TODAY,
        pathMatch: 'full',
      },
      {
        path: ':todosDay',
        loadComponent: () =>
          import('./pages/main-page/main-content/main-content.component').then(
            (m) => m.MainContentComponent,
          ),
      },
    ],
  },
];

import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  public canActivate(): boolean {
    if (this.localStorage.getTokenLocalStorage()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

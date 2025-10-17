import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardService implements CanActivate {
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  public canActivate(): boolean {
    if (this.localStorage.getTokenLocalStorage()) {
      this.router.navigate(['/todos']);
      return false;
    }

    return true;
  }
}

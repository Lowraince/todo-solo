import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';
import { RootPages } from '../interfaces/enums';

@Injectable({
  providedIn: 'root',
})
export class LoginGuardService implements CanActivate {
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  public canActivate(): boolean {
    if (this.localStorage.getTokenLocalStorage()) {
      console.log('test');
      this.router.navigate([`/${RootPages.MAIN}`]);
      return false;
    }
    console.log('test');
    return true;
  }
}

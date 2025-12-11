import { Injectable } from '@angular/core';
import { AppThemesType } from '../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public setTokenLocalStorage(value: string): void {
    localStorage.setItem('token-todo', value);
  }

  public getTokenLocalStorage(): string | null {
    return localStorage.getItem('token-todo') || null;
  }

  public removeTokenLocalStorage(): void {
    localStorage.removeItem('token-todo');
  }

  public setAppThemeLocalStorage(theme: AppThemesType): void {
    localStorage.setItem('app-theme', theme);
  }

  public getAppThemeLocalStorage(): string | null {
    return localStorage.getItem('app-theme') || null;
  }
}

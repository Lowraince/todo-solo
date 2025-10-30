import { Injectable } from '@angular/core';

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
}

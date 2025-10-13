import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, finalize, tap } from 'rxjs';
import { UserProfile } from '../interfaces/interface-api';
import { ApiService } from './api.service';
import { GetToken } from '../interfaces/types';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

interface AuthState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  private authState = new BehaviorSubject<AuthState>({
    userProfile: null,
    isLoading: false,
    error: null,
  });

  public authState$ = this.authState.asObservable();

  public registrationUser(newUser: UserProfile): void {
    this.setLoading(true);

    this.apiService
      .postUser(newUser)
      .pipe(
        tap((value: GetToken) =>
          this.localStorage.setTokenLocalStorage(value.token),
        ),
        finalize(() => this.setLoading(false)),
        catchError((error) => {
          console.error(`Error user create: ${error.message}`);
          this.authState.next({
            ...this.authState.value,
            error: `Error user create: ${error.message}`,
          });
          return EMPTY;
        }),
      )
      .subscribe((value: GetToken) => {
        this.fetchUserProfile(value.token, false);
      });
  }

  private fetchUserProfile(token: string, redirectOnError = true): void {
    this.setLoading(true);

    this.apiService
      .getUserProfile(token)
      .pipe(
        tap((profile: UserProfile) => {
          this.authState.next({
            userProfile: profile,
            isLoading: false,
            error: null,
          });

          this.router.navigate(['/todos']);
        }),
        catchError((error) => {
          console.error(`Error user profile: ${error.message}`);
          this.authState.next({
            ...this.authState.value,
            error: `Error user profile: ${error.message}`,
          });

          if (redirectOnError) {
            this.router.navigate(['/login']);
          }

          return EMPTY;
        }),
        finalize(() => this.setLoading(false)),
      )
      .subscribe();
  }

  public initProfile(): void {
    const token = this.localStorage.getTokenLocalStorage();
    if (token) {
      this.fetchUserProfile(token);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public setLoading(value: boolean): void {
    this.authState.next({
      ...this.authState.value,
      isLoading: value,
      error: null,
    });
  }
}

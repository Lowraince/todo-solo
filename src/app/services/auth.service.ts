import { DestroyRef, inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  Observable,
  tap,
} from 'rxjs';
import { UserProfile } from '../interfaces/interface-api';
import { ApiService } from './api.service';
import { GetToken } from '../interfaces/types';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

  private authState = new BehaviorSubject<AuthState>({
    userProfile: null,
    isLoading: false,
    error: null,
  });

  public authState$ = this.authState.asObservable();

  public registrationUser(newUser: UserProfile): Observable<GetToken> {
    this.setLoading(true);

    return this.apiService.postUser(newUser).pipe(
      tap((value: GetToken) => {
        this.localStorage.setTokenLocalStorage(value.token);
        this.fetchUserProfile(value.token, false);
      }),
      catchError((error) => {
        console.error(`Error user create: ${error.message}`);
        this.authState.next({
          ...this.authState.value,
          error: `Error user create: ${error.message}`,
        });
        return EMPTY;
      }),
      finalize(() => this.setLoading(false)),
    );
  }

  private fetchUserProfile(token: string, redirectOnError = true): void {
    this.setLoading(true);

    this.apiService
      .getUserProfile(token)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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

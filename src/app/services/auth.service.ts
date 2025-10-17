import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  Observable,
  of,
  take,
  tap,
} from 'rxjs';
import { UserLogin, UserProfile } from '../interfaces/interface-api';
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
        tap((profile: UserProfile) => {
          this.authState.next({
            userProfile: profile,
            isLoading: false,
            error: null,
          });

          this.router.navigate(['/todos'], { replaceUrl: true });
        }),
        catchError((error) => {
          console.error(`Error user profile: ${error.message}`);
          this.authState.next({
            ...this.authState.value,
            error: `Error user profile: ${error.message}`,
          });

          if (redirectOnError) {
            this.router.navigate(['/login'], { replaceUrl: true });
          }

          return EMPTY;
        }),
        finalize(() => this.setLoading(false)),
        take(1),
      )
      .subscribe();
  }

  public initProfile(): void {
    const token = this.localStorage.getTokenLocalStorage();
    if (token) {
      this.fetchUserProfile(token);
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  public loginUser({
    userName,
    password,
  }: UserLogin): Observable<GetToken> | Observable<string> {
    const token = this.localStorage.getTokenLocalStorage();
    this.setLoading(true);

    if (token) {
      this.initProfile();
      this.setLoading(false);
      return of(token);
    } else {
      return this.apiService.loginUser({ userName, password }).pipe(
        tap((value: GetToken) => {
          this.localStorage.setTokenLocalStorage(value.token);
        }),
        catchError((error: Error) => {
          console.error(`Login error: ${error.message}`);
          this.authState.next({
            ...this.authState.value,
            error: `Error user create: ${error.message}`,
          });

          return EMPTY;
        }),
        finalize(() => this.setLoading(false)),
      );
    }
  }

  private setLoading(value: boolean): void {
    this.authState.next({
      ...this.authState.value,
      isLoading: value,
      error: null,
    });
  }
}

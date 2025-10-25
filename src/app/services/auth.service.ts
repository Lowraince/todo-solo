import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  Observable,
  of,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import { UserLogin, UserProfile } from '../interfaces/interface-api';
import { ApiService } from './api.service';
import { GetToken } from '../interfaces/types';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { RootPages } from '../interfaces/enums';
import { LoadingService } from './loading.service';

interface AuthState {
  userProfile: UserProfile | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);
  private modalLoaderService = inject(LoadingService);

  private authState = new BehaviorSubject<AuthState>({
    userProfile: null,
    error: null,
  });

  public authState$ = this.authState.asObservable();

  public registrationUser(newUser: UserProfile): Observable<GetToken> {
    this.modalLoaderService.openModal('Account creation is underway');

    return this.apiService.postCreateUser(newUser).pipe(
      tap((value: GetToken) => {
        this.localStorage.setTokenLocalStorage(value.token);

        timer(1000)
          .pipe(take(1))
          .subscribe(() => {
            this.fetchUserProfile(value.token, false);
          });
      }),
      catchError((error) => {
        console.error(`Error user create: ${error.message}`);
        this.authState.next({
          ...this.authState.value,
          error: `Error user create: ${error.message}`,
        });
        return EMPTY;
      }),
    );
  }

  private fetchUserProfile(token: string, redirectOnError = true): void {
    this.apiService
      .getUserProfile(token)
      .pipe(
        tap((profile: UserProfile) => {
          this.authState.next({
            userProfile: profile,
            error: null,
          });
          this.router.navigate([`/${RootPages.MAIN}`], { replaceUrl: true });
        }),
        catchError((error) => {
          console.error(`Error user profile: ${error.message}`);
          this.authState.next({
            ...this.authState.value,
            error: `Error user profile: ${error.message}`,
          });

          if (redirectOnError) {
            this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
          }

          return EMPTY;
        }),
        take(1),
        finalize(() => this.modalLoaderService.hideModal()),
      )
      .subscribe();
  }

  public initProfile(): void {
    const token = this.localStorage.getTokenLocalStorage();
    if (token) {
      this.fetchUserProfile(token);
    } else {
      this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
    }
  }

  public loginUserAuth({
    userName,
    password,
  }: UserLogin): Observable<GetToken> {
    return this.apiService.postLoginUser({ userName, password }).pipe(
      switchMap((value: GetToken) => {
        this.localStorage.setTokenLocalStorage(value.token);
        this.fetchUserProfile(value.token, false);

        return of(value);
      }),
      catchError((error: Error) => {
        console.error(`Login error: ${error.message}`);
        this.authState.next({
          ...this.authState.value,
          error: `Login error: ${error.message}`,
        });
        return EMPTY;
      }),
    );
  }
}

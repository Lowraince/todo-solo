import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  take,
  tap,
  timer,
} from 'rxjs';
import {
  GetUserProfile,
  PostCreateUser,
  postLoginUser,
  UserProfileState,
} from '../interfaces/interface-api';
import { ApiService } from './api.service';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { GetToken } from '../interfaces/types';
import { RootPages } from '../interfaces/enums';

interface AuthState {
  userProfile: UserProfileState | null;
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

  public registrationUser(newUser: PostCreateUser): Observable<GetUserProfile> {
    this.modalLoaderService.openModal('Account creation is in progress...');

    return this.apiService.postCreateUser(newUser).pipe(
      map((userToken: GetToken) => userToken.token),
      switchMap((token: string) =>
        this.afterSuccessfullAuth(token).pipe(
          tap(() =>
            this.modalLoaderService.updateTextModalSuccess(
              'Account created successfully.',
            ),
          ),
        ),
      ),
    );
  }

  public fetchUserProfile(): Observable<GetUserProfile> {
    return this.apiService.getUserProfile().pipe(
      tap((userProfile: GetUserProfile) => {
        const currentState = this.authState.value;
        this.authState.next({
          ...currentState,
          userProfile: userProfile.data,
        });

        timer(800)
          .pipe(take(1))
          .subscribe(() => {
            this.modalLoaderService.hideModal();
            this.router.navigate([RootPages.MAIN]);
          });
      }),
    );
  }

  public loginUserAuth({
    userName,
    password,
  }: postLoginUser): Observable<GetUserProfile> {
    this.modalLoaderService.openModal('Signing in...');

    return this.apiService.postLoginUser({ userName, password }).pipe(
      map((userToken: GetToken) => userToken.token),
      switchMap((token: string) =>
        this.afterSuccessfullAuth(token).pipe(
          tap(() =>
            tap(() =>
              this.modalLoaderService.updateTextModalSuccess('Welcome back!'),
            ),
          ),
        ),
      ),
    );
  }

  private afterSuccessfullAuth(token: string): Observable<GetUserProfile> {
    this.localStorage.setTokenLocalStorage(token);

    return this.fetchUserProfile();
  }

  // public registrationUser(newUser: UserProfile): Observable<GetToken> {
  //   this.modalLoaderService.openModal('Account creation is in progress...');

  //   return this.apiService.postCreateUser(newUser).pipe(
  //     tap((value: GetToken) => {
  //       this.localStorage.setTokenLocalStorage(value.token);

  //       this.modalLoaderService.updateTextModalSuccess(
  //         'Account created successfully.',
  //       );

  //       timer(1000)
  //         .pipe(take(1))
  //         .subscribe(() => {
  //           this.fetchUserProfile(value.token, false);
  //         });
  //     }),
  //     catchError((error) => {
  //       console.error(`Error user create: ${error.message}`);
  //       this.authState.next({
  //         ...this.authState.value,
  //         error: `Error user create: ${error.message}`,
  //       });
  //       return EMPTY;
  //     }),
  //   );
  // }

  // private fetchUserProfile(token: string, redirectOnError = true): void {
  //   this.apiService
  //     .getUserProfile(token)
  //     .pipe(
  //       tap((profile: GetUserProfile) => {
  //         this.authState.next({
  //           userProfile: profile.data,
  //           error: null,
  //         });

  //         this.modalLoaderService.hideModal();

  //         this.router.navigate([`/${RootPages.MAIN}`], { replaceUrl: true });
  //       }),
  //       catchError((error) => {
  //         console.error(`Error user profile: ${error.message}`);
  //         this.authState.next({
  //           ...this.authState.value,
  //           error: `Error user profile: ${error.message}`,
  //         });

  //         if (redirectOnError) {
  //           this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
  //         }

  //         return EMPTY;
  //       }),
  //       take(1),
  //       finalize(() => this.modalLoaderService.hideModal()),
  //     )
  //     .subscribe();
  // }

  // public initProfile(): void {
  //   const token = this.localStorage.getTokenLocalStorage();
  //   if (token) {
  //     this.fetchUserProfile(token);
  //   } else {
  //     this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
  //   }
  // }

  // public loginUserAuth({
  //   userName,
  //   password,
  // }: UserLogin): Observable<GetToken> {
  //   this.modalLoaderService.openModal('Signing in...');

  //   return this.apiService.postLoginUser({ userName, password }).pipe(
  //     tap((value: GetToken) => {
  //       this.localStorage.setTokenLocalStorage(value.token);
  //       this.fetchUserProfile(value.token, false);
  //     }),
  //     catchError((error: Error) => {
  //       console.error(`Login error: ${error.message}`);
  //       this.authState.next({
  //         ...this.authState.value,
  //         error: `Login error: ${error.message}`,
  //       });
  //       return EMPTY;
  //     }),
  //   );
  // }

  // public logoutUser(): void {
  //   this.localStorage.removeTokenLocalStorage();

  //   this.authState.next({
  //     userProfile: null,
  //     error: null,
  //   });

  //   this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
  // }
}

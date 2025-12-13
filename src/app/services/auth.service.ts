import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  exhaustMap,
  map,
  Observable,
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
  });

  public authState$ = this.authState.asObservable();

  public registrationUser(newUser: PostCreateUser): Observable<GetUserProfile> {
    this.modalLoaderService.openModal('Account creation is in progress...');

    return this.apiService.postCreateUser(newUser).pipe(
      map((userToken: GetToken) => userToken.token),
      exhaustMap((token: string) =>
        this.afterSuccessfullAuth(token).pipe(
          tap(() =>
            this.modalLoaderService.updateTextModalSuccess(
              'Account created successfully.',
            ),
          ),
          catchError((error) => {
            console.error(`Error user create: ${error.message}`);

            this.modalLoaderService.updateTextModalError(
              'Something went wrong',
            );

            timer(800)
              .pipe(take(1))
              .subscribe(() => {
                this.modalLoaderService.hideModal();
              });
            return EMPTY;
          }),
        ),
      ),
    );
  }

  public fetchUserProfile(
    transfer: boolean = true,
  ): Observable<GetUserProfile> {
    return this.apiService.getUserProfile().pipe(
      tap((userProfile: GetUserProfile) => {
        const currentState = this.authState.value;
        this.authState.next({
          ...currentState,
          userProfile: userProfile.data,
        });

        if (transfer) {
          timer(800)
            .pipe(take(1))
            .subscribe(() => {
              this.modalLoaderService.hideModal();
              this.router.navigate([RootPages.MAIN]);
            });
        }
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
      exhaustMap((token: string) =>
        this.afterSuccessfullAuth(token).pipe(
          tap(() =>
            this.modalLoaderService.updateTextModalSuccess('Welcome back!'),
          ),
        ),
      ),
      catchError((error: Error) => {
        console.error(`Login error: ${error.message}`);
        this.modalLoaderService.updateTextModalError(
          'Incorrect nickname or password!',
        );
        timer(1000)
          .pipe(take(1))
          .subscribe(() => {
            this.modalLoaderService.hideModal();
          });

        return EMPTY;
      }),
    );
  }

  private afterSuccessfullAuth(token: string): Observable<GetUserProfile> {
    this.localStorage.setTokenLocalStorage(token);

    return this.fetchUserProfile();
  }

  public logoutUser(): void {
    this.localStorage.removeTokenLocalStorage();

    this.authState.next({
      userProfile: null,
    });

    this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
  }
}

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { RootPages } from '../interfaces/enums';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  private URLBASE = 'http://localhost:3004';
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStorage.getTokenLocalStorage();

    let modifiedRequest = request;

    if (!request.url.startsWith('http')) {
      const fullUrl = `${this.URLBASE}/${request.url}`;
      modifiedRequest = request.clone({ url: fullUrl });
    }

    if (token) {
      modifiedRequest = modifiedRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          this.localStorage.removeTokenLocalStorage();
          this.router.navigate([`/${RootPages.LOGIN}`], { replaceUrl: true });
        }

        return throwError(() => error);
      }),
    );
  }
}

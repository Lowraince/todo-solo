import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  private URLBASE = 'http://localhost:3004';
  private localStorage = inject(LocalStorageService);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStorage.getTokenLocalStorage();
    console.log(token, 'mod req');
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

    console.log(modifiedRequest, 'mod req');

    return next.handle(modifiedRequest);
  }
}

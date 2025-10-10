import { Directive, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { ApiService } from '../services/api.service';
import {
  catchError,
  debounceTime,
  first,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

@Directive({
  selector: '[appAsyncValidatorNickname]',
  standalone: true,
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AsyncValidatorNicknameDirective,
      multi: true,
    },
  ],
})
export class AsyncValidatorNicknameDirective implements AsyncValidator {
  private apiService = inject(ApiService);

  public validate(
    control: AbstractControl,
  ): Observable<ValidationErrors | null> {
    if (!control.value || control.invalid) {
      return of(null);
    }

    return of(control.value).pipe(
      debounceTime(500),
      switchMap((value) => this.apiService.checkUserName(value)),
      map((result) => (result ? { nicknameTaken: true } : null)),
      catchError(() => of(null)),
      first(),
    );
  }
}

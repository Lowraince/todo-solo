import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, map, catchError, switchMap, timer, take } from 'rxjs';
import { ApiService } from '../../../services/api.service';

export function asyncValidatorUsername(apiService: ApiService) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.invalid) {
      return of(null);
    }

    return timer(8000).pipe(
      switchMap(() => apiService.checkUserName(control.value)),
      map((result) => (result.exists ? { nicknameTaken: true } : null)),
      catchError(() => of(null)),
      take(1),
    );
  };
}

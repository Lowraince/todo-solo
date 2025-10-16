import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasDigit(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;

  const hasDigit = /\d/.test(value);

  return hasDigit ? { hasDigit: true } : null;
}

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emptyValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value: string = control.value;

  if (!value) {
    return null;
  }

  return value === value.trim() ? null : { noEmpty: true };
}

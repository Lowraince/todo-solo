import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strengthPassword(
  control: AbstractControl,
): ValidationErrors | null {
  const value: string = control.value;

  if (value.length === 0) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]/.test(value);

  const isStrong =
    hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars;

  return isStrong ? null : { isStrong: true };
}

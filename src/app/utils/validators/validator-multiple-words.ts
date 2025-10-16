import { AbstractControl, ValidationErrors } from '@angular/forms';

export function multipleWords(
  control: AbstractControl,
): ValidationErrors | null {
  const value: string = control.value;

  const words = value.trim().split(/\s+/);

  return words.length > 1 ? { multipleWords: true } : null;
}

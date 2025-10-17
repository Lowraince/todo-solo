import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noSpaces(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value;

  if (!value) {
    return null;
  }

  return value.includes(' ') ? { noSpaces: true } : null;
}

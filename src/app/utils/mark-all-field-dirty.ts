import { FormGroup } from '@angular/forms';

export function markAllFieldsAsDirty(form: FormGroup): void {
  for (const key of Object.keys(form.controls)) {
    const control = form.get(key);
    control?.markAsDirty();
  }
}

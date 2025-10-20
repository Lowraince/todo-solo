import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { ApiService } from '../../services/api.service';
import { UserProfile } from '../../interfaces/interface-api';
import { AuthService } from '../../services/auth.service';
import { exhaustMap, map, of } from 'rxjs';
import { markAllFieldsAsDirty } from '../../utils/mark-all-field-dirty';
import { multipleWordsValidator } from '../../utils/validators/validator-multiple-words';
import { usernameAsyncValidator } from '../../utils/validators/async-validators/async-validator-username';
import { strengthPasswordValidator } from '../../utils/validators/validator-strength-password';
import { noSpacesValidator } from '../../utils/validators/validator-no-spaces';
import { hasDigitValidator } from '../../utils/validators/validator-has-digit';
import { ButtonSignComponent } from '../../components/buttons/button-sign/button-sign.component';

@Component({
  selector: 'app-registration-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputFieldComponent,
    ButtonSignComponent,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  public isLoading$ = this.authService.authState$.pipe(
    map((state) => state.isLoading),
  );

  public registrationForm = new FormGroup(
    {
      userName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
          multipleWordsValidator,
          noSpacesValidator,
        ],
        asyncValidators: [usernameAsyncValidator(this.apiService)],
      }),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        strengthPasswordValidator,
        noSpacesValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      realName: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(3),
        hasDigitValidator,
        noSpacesValidator,
      ]),
    },
    { validators: [this.passwordMatchValidator] },
  );

  public onSubmit(event: Event): void {
    event.preventDefault();
    const form = this.registrationForm;

    markAllFieldsAsDirty(this.registrationForm);

    if (form.invalid) return;

    const value = form.value;

    if (!value.userName || !value.password || !value.realName) {
      return;
    }

    const newUser: UserProfile = {
      userName: value.userName.trim(),
      password: value.password.trim(),
      name: value.realName.trim(),
    };

    of(newUser)
      .pipe(exhaustMap((newUser) => this.authService.registrationUser(newUser)))
      .subscribe(() => form.reset());
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value && confirmPassword.value) {
      if (password.value === confirmPassword.value) {
        confirmPassword.setErrors(null);
      } else {
        confirmPassword.setErrors({ passwordMismatch: true });
      }
    }
    return null;
  }
}

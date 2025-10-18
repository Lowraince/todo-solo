import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { multipleWords } from '../../utils/validators/validator-multiple-words';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { ApiService } from '../../services/api.service';
import { strengthPassword } from '../../utils/validators/validator-strength-password';
import { noSpaces } from '../../utils/validators/validator-no-spaces';
import { UserProfile } from '../../interfaces/interface-api';
import { AuthService } from '../../services/auth.service';
import { exhaustMap, map, of } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { hasDigit } from '../../utils/validators/validator-has-digit';
import { markAllFieldsAsDirty } from '../../utils/mark-all-field-dirty';
import { asyncValidatorUsername } from '../../utils/validators/async-validators/async-validator-username';

@Component({
  selector: 'app-registration-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InputFieldComponent,
    AsyncPipe,
    NgClass,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
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
          multipleWords,
        ],
        asyncValidators: [asyncValidatorUsername(this.apiService)],
      }),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        strengthPassword,
        noSpaces,
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      realName: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(3),
        hasDigit,
      ]),
    },
    { validators: [this.passwordMatchValidator] },
  );

  public ngOnInit(): void {}

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
      userName: value.userName,
      password: value.password,
      name: value.realName,
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

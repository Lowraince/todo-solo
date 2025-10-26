import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserLogin } from '../../interfaces/interface-api';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, exhaustMap, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PasswordFieldType } from '../../interfaces/types';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { markAllFieldsAsDirty } from '../../utils/mark-all-field-dirty';

import { ButtonSignComponent } from '../../components/buttons/button-sign/button-sign.component';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    InputFieldComponent,
    ButtonSignComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  public changeViewPassword$ = new BehaviorSubject(false);

  public changeTypePassword$ = new BehaviorSubject<PasswordFieldType>(
    'password',
  );

  public loginForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public onSubmit(event: Event): void {
    event.preventDefault();
    const form = this.loginForm;

    markAllFieldsAsDirty(form);

    if (form.invalid) return;

    const formValue = form.value;

    if (!formValue.userName || !formValue.password) return;

    const currentUser: UserLogin = {
      userName: formValue.userName,
      password: formValue.password,
    };

    of(currentUser)
      .pipe(
        exhaustMap((currentUser) =>
          this.authService.loginUserAuth(currentUser),
        ),
      )
      .subscribe();
  }

  public changePasswordView(viewPassword: PasswordFieldType): void {
    this.changeTypePassword$.next(viewPassword);
  }
}

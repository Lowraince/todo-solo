import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserLogin } from '../../interfaces/interface-api';
import { AuthService } from '../../services/auth.service';
import { exhaustMap, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [InputFieldComponent, ReactiveFormsModule, AsyncPipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private authService = inject(AuthService);

  public isLoading$ = this.authService.authState$.pipe(
    map((state) => state.isLoading),
  );

  public loginForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public onSubmit(event: Event): void {
    event.preventDefault();
    const form = this.loginForm;

    if (form.invalid) return;

    const formValue = form.value;

    if (!formValue.userName || !formValue.password) return;

    const currentUser: UserLogin = {
      userName: formValue.userName,
      password: formValue.password,
    };

    of(currentUser)
      .pipe(
        exhaustMap((currentUser) => this.authService.loginUser(currentUser)),
      )
      .subscribe(() => this.loginForm.reset());
  }
}

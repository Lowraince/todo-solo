import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { multipleWords } from '../../utils/validator-multiple-words';
import { InputFieldComponent } from '../../components/input-field/input-field.component';
import { asyncValidatorUsername } from '../../utils/async-validator-username';
import { ApiService } from '../../services/api.service';
import { strengthPassword } from '../../utils/validator-strength-password';
import { noSpaces } from '../../utils/validator-no-spaces';
import { UserProfile } from '../../interfaces/interface-api';
import { AuthService } from '../../services/auth.service';
import { exhaustMap, of } from 'rxjs';

@Component({
  selector: 'app-registration-page',
  imports: [ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  public registrationForm = new FormGroup({
    userName: new FormControl('', {
      validators: [
        Validators.required,
        Validators.maxLength(10),
        multipleWords,
      ],
      asyncValidators: [asyncValidatorUsername(this.apiService)],
    }),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      strengthPassword,
      noSpaces,
    ]),
    realName: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      Validators.minLength(3),
    ]),
  });

  public ngOnInit(): void {}

  public onSubmit(event: Event): void {
    event.preventDefault();
    const form = this.registrationForm;

    if (!form.valid) return;

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
}

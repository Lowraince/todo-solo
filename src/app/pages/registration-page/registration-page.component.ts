/* eslint-disable @typescript-eslint/member-ordering */
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

@Component({
  selector: 'app-registration-page',
  imports: [ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  private apiService = inject(ApiService);

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
    console.log(form);
    if (!form.valid) return;
  }
}

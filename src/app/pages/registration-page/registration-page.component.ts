import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { multipleWords } from '../../utils/validator-multiple-words';
import { InputFieldComponent } from '../../components/input-field/input-field.component';

@Component({
  selector: 'app-registration-page',
  imports: [ReactiveFormsModule, RouterLink, InputFieldComponent],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPageComponent implements OnInit {
  public registrationForm = new FormGroup({
    userName: new FormControl('', [
      Validators.required,
      Validators.maxLength(10),
      multipleWords,
    ]),
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

  public ngOnInit(): void {
    // this.registrationForm.get("userName")?.asyncValidator.
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    const form = this.registrationForm;
    console.log(form);
    if (!form.valid) return;
  }

  public isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  public hasError(fieldName: string, error: string): boolean {
    const field = this.registrationForm.get(fieldName);

    return field ? field.hasError(error) && field.touched : false;
  }
}

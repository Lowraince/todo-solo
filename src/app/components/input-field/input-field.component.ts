import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckIconComponent } from '../../icons/check-icon/check-icon.component';
import { ErrorMessagesService } from '../../services/error-messages.service';
import { ViewIconComponent } from '../../icons/view-icon/view-icon.component';
import { NotViewIconComponent } from '../../icons/not-view-icon/not-view-icon.component';

@Component({
  selector: 'app-input-field',
  imports: [
    ReactiveFormsModule,
    NgClass,
    CheckIconComponent,
    ViewIconComponent,
    NotViewIconComponent,
  ],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ErrorMessagesService],
})
export class InputFieldComponent {
  @Input() public control!: FormControl<string | null>;
  @Input() public type!: string;
  @Input() public inputName!: string;
  @Input() public applyAsyncValidator: boolean = false;
  @Input() public loginPassword: boolean = false;
  @Input() public registrationInput: boolean = true;

  @Output() public changePasswordView = new EventEmitter<'text' | 'password'>();

  public errorMessages = inject(ErrorMessagesService);

  public controlHasLength(): boolean {
    return this.control.value?.length === 0;
  }

  public isControlInvalid(control: FormControl): boolean {
    return control.invalid && control.dirty;
  }

  public isValidAndTouched(): boolean {
    return this.control.valid && !this.control.pristine;
  }

  public toggleViewPassword(): void {
    const isPassword = this.type === 'password' ? 'text' : 'password';

    this.changePasswordView.emit(isPassword);
  }
}

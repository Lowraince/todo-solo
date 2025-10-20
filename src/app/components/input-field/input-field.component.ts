import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { CheckIconComponent } from '../../icons/check-icon/check-icon.component';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, NgClass, CapitalizePipe, CheckIconComponent],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  @Input() public control!: FormControl<string | null>;
  @Input() public type!: string;
  @Input() public inputName!: string;
  @Input() public applyAsyncValidator: boolean = false;

  public controlHasLength(): boolean {
    return this.control.value?.length === 0;
  }

  public isControlInvalid(control: FormControl): boolean {
    return control.invalid && control.dirty;
  }

  public isValidAndTouched(): boolean {
    return this.control.valid && !this.control.pristine;
  }
}

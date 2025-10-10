import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, NgClass, CapitalizePipe],
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
}

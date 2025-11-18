import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MinusIconComponent } from '../../icons/minus-icon/minus-icon.component';
import { PlusIconComponent } from '../../icons/plus-icon/plus-icon.component';
import { PeachIconComponent } from '../../icons/peach-icon/peach-icon.component';

export type ChangeDirection = 'plus' | 'minus';

@Component({
  selector: 'app-input-increase',
  imports: [
    NgClass,
    ReactiveFormsModule,
    MinusIconComponent,
    PlusIconComponent,
    PeachIconComponent,
  ],
  templateUrl: './input-increase.component.html',
  styleUrl: './input-increase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputIncreaseComponent {
  @Input({ required: true }) public control!: FormControl;

  @Output() public valueChange = new EventEmitter<ChangeDirection>();
  @Output() public activeValueCountChange = new EventEmitter<number>();

  public onInput(event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) return;

    let value = input.value.replace(/^0+(?=\d)/, '');

    if (value === '') {
      value = '0';
    }

    const number = Number(value);

    if (number > 1000) {
      value = '1000';
    }

    input.value = value;

    this.updateValue(number);
  }

  private updateValue(newValue: number): void {
    if (newValue > 1000) {
      newValue = 1000;
    } else if (newValue < 0) {
      newValue = 0;
    }

    this.activeValueCountChange.emit(newValue);
  }

  public changeValue(direction: ChangeDirection): void {
    this.valueChange.emit(direction);
  }

  public isMinValue(): boolean {
    return this.control.value === 0;
  }

  public isMaxValue(): boolean {
    return this.control.value === 1000;
  }
}

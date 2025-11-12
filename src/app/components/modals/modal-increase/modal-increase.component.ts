import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { MinusIconComponent } from '../../../icons/minus-icon/minus-icon.component';
import { PlusIconComponent } from '../../../icons/plus-icon/plus-icon.component';
import { PeachIconComponent } from '../../../icons/peach-icon/peach-icon.component';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export type ChangeDirection = 'plus' | 'minus';

@Component({
  selector: 'app-modal-increase',
  imports: [
    MinusIconComponent,
    PlusIconComponent,
    PeachIconComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-increase.component.html',
  styleUrl: './modal-increase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalIncreaseComponent {
  @Input({ required: true }) public control!: FormControl;

  @Output() public valueChange = new EventEmitter<ChangeDirection>();
  @Output() public activeValueCountChange = new EventEmitter<number>();

  private element = inject(ElementRef);
  private openModalState = inject(ModalsOpenService);

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.openModalState.closeModal('increaseModal');
    }
  }

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

    console.log(typeof value, 'last');
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
}

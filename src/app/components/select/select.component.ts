import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export type EmitterSelect<T extends string> = {
  control: FormControl<T | null>;
  value: T;
};

@Component({
  selector: 'app-select',
  imports: [NgClass, ReactiveFormsModule, AsyncPipe],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T extends string> {
  @Input({ required: true }) public controlSelect!: FormControl<T | null>;
  @Input({ required: true }) public valueOption!: T[] | null;
  @Input() public optionalValue!: string;

  @Output() public changeValue = new EventEmitter<EmitterSelect<T>>();

  public isOpenSelect$ = new BehaviorSubject<boolean>(false);

  public getDisplayValue(item: string): string {
    return this.optionalValue ? `${item} ${this.optionalValue}` : item;
  }

  public toggleSelect(): void {
    this.isOpenSelect$.next(!this.isOpenSelect$.value);
  }

  public changeValueOption(item: T): void {
    this.changeValue.emit({ control: this.controlSelect, value: item });
  }
}

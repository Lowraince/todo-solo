import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmitterSelect } from '../../interfaces/types';

@Component({
  selector: 'app-select',
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  @Input({ required: true }) public controlSelect!: FormControl<string | null>;
  @Input({ required: true }) public valueOption!: string[] | null;
  @Input() public optionalValue!: string;

  @Output() public changeValue = new EventEmitter<EmitterSelect>();

  public isOpen: boolean = false;

  public getDisplayValue(item: string): string {
    return this.optionalValue ? `${item} ${this.optionalValue}` : item;
  }

  public toggleSelect(): void {
    this.isOpen = !this.isOpen;
  }

  public changeValueOption(item: string): void {
    this.changeValue.emit({ control: this.controlSelect, value: item });
  }
}

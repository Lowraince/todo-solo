import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SidebarItemsType } from '../../interfaces/types';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent {
  @Input({ required: true }) public title!: SidebarItemsType;
  @Input({ required: true }) public isActive!: boolean;

  @Output() public toggleItem = new EventEmitter<{
    title: SidebarItemsType;
    isActive: boolean;
  }>();

  public toggleActive(): void {
    this.toggleItem.emit({ title: this.title, isActive: this.isActive });
  }
}

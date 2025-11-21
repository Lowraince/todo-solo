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
import { getPriority } from '../../../utils/get-priority';
import { FlagIconComponent } from '../../../icons/flag-icon/flag-icon.component';
import { PriorityTodos } from '../../../interfaces/enums';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-setting-todo',
  imports: [FlagIconComponent, NgClass],
  templateUrl: './modal-setting-todo.component.html',
  styleUrl: './modal-setting-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingTodoComponent {
  @Input({ required: true }) public flagActive!: string;
  @Input({ required: true }) public modalActive!: boolean;

  @Output() public changeModalOpen = new EventEmitter<boolean>();

  private element = inject(ElementRef);

  public priorityArray = getPriority();

  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.element.nativeElement.contains(event.target)) {
      this.changeModalOpen.emit(false);
    }
  }

  public getClassPriority(className: PriorityTodos): string {
    const objectClass = {
      [PriorityTodos.NO_PRIO]: 'no_prio',
      [PriorityTodos.LOW_PRIO]: 'low_prio',
      [PriorityTodos.MEDIUM_PRIO]: 'medium_prio',
      [PriorityTodos.HIGH_PRIO]: 'high_prio',
    };

    return objectClass[className];
  }
}

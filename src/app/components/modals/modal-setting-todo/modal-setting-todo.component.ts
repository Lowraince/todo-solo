import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { getPriority } from '../../../utils/get-priority';
import { FlagIconComponent } from '../../../icons/flag-icon/flag-icon.component';
import { ButtonsTodoSettings, PriorityTodos } from '../../../interfaces/enums';
import { NgClass } from '@angular/common';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { filter, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITodo, TodosService } from '../../../services/todos.service';
import { getClassPriority } from '../../../utils/class-priority';
import {
  ButtonsTodoSettingsType,
  PriorityType,
} from '../../../interfaces/types';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { formatedDateISO } from '../../../utils/formated-date-iso';

@Component({
  selector: 'app-modal-setting-todo',
  imports: [FlagIconComponent, NgClass, CapitalizePipe],
  templateUrl: './modal-setting-todo.component.html',
  styleUrl: './modal-setting-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSettingTodoComponent implements OnInit {
  @Input({ required: true }) public todo!: ITodo;
  @Input({ required: true }) public modalActive!: boolean;

  @Output() public changeModalOpen = new EventEmitter<boolean>();
  @Output() public priorityChanged = new EventEmitter<PriorityType>();

  private element = inject(ElementRef);
  private openModalService = inject(ModalsOpenService);
  private todosState = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  public buttonsTodoSettings = [
    ButtonsTodoSettings.TODAY,
    ButtonsTodoSettings.TOMORROW,
    ButtonsTodoSettings.SHEDULE,
  ];

  private modalConfirm$ = this.openModalService.modalsState$.pipe(
    map((state) => state.confirmModal),
  );

  private modalConfirmIsOpen: boolean = false;

  public priorityArray = getPriority();

  public ngOnInit(): void {
    this.modalConfirm$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.modalConfirmIsOpen = value));
  }

  @HostListener('document:mousedown', ['$event'])
  public onClickOutside(event: Event): void {
    if (
      !this.element.nativeElement.contains(event.target) &&
      !this.modalConfirmIsOpen
    ) {
      this.changeModalOpen.emit(false);
    }
  }

  public changePriority(priority: PriorityType): void {
    this.priorityChanged.emit(priority);
  }

  public deleteClickHandler(): void {
    this.openModalService
      .openConfirmModal(this.todo.description)
      .pipe(
        filter(Boolean),
        switchMap(() => this.todosState.deleteTodo(this.todo.idTodo)),
      )
      .subscribe();
  }

  public getClassPriority(priority: PriorityTodos): string {
    return getClassPriority(priority);
  }

  public isButtonActive(buttonName: ButtonsTodoSettingsType): boolean {
    const createTodoSlice = this.todo.timeToCreate.slice(0, 10);

    if (
      createTodoSlice === formatedDateISO('today') &&
      buttonName === ButtonsTodoSettings.TODAY
    ) {
      return true;
    } else if (
      createTodoSlice === formatedDateISO('tomorrow') &&
      buttonName === ButtonsTodoSettings.TOMORROW
    ) {
      return true;
    }

    return false;
  }

  public changeTodoDate(buttonName: ButtonsTodoSettingsType): void {
    const idTodo = this.todo.idTodo;
    if (
      buttonName === ButtonsTodoSettings.TODAY ||
      buttonName === ButtonsTodoSettings.TOMORROW
    ) {
      this.todosState
        .changeDateTodo(idTodo, buttonName)
        .pipe(tap(() => this.changeModalOpen.emit(false)))
        .subscribe();
    } else if (buttonName === ButtonsTodoSettings.SHEDULE) {
      console.log('shedule');
    }
  }
}

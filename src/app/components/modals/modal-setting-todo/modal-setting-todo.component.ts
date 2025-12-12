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
import { AsyncPipe, NgClass } from '@angular/common';
import { ModalsOpenService } from '../../../services/modals-open.service';
import { BehaviorSubject, filter, map, switchMap, tap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ITodo, TodosService } from '../../../services/todos.service';
import { getClassPriority } from '../../../utils/class-priority';
import {
  ButtonsTodoSettingsType,
  PriorityType,
} from '../../../interfaces/types';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { formatedDateISO } from '../../../utils/formated-date-iso';
import { CalendarComponent } from '../../calendar/calendar.component';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';

@Component({
  selector: 'app-modal-setting-todo',
  imports: [
    FlagIconComponent,
    NgClass,
    CapitalizePipe,
    AsyncPipe,
    CalendarComponent,
    ModalConfirmComponent,
  ],
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

  public modalConfirm$ = this.openModalService.modalsState$.pipe(
    map((state) => state.confirmModal),
  );

  private isOpenCalendar = new BehaviorSubject<{
    isHover: boolean;
    isTarget: boolean;
  }>({
    isHover: false,
    isTarget: false,
  });

  private isOpenCalendar$ = this.isOpenCalendar.asObservable();

  public isTargetCalendar$ = this.isOpenCalendar$.pipe(
    map((state) => state.isTarget),
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

  public confirmCloseSettings(): void {
    this.changeModalOpen.emit(false);
  }

  public openCalendar(): void {
    this.isOpenCalendar.next({
      isTarget: true,
      isHover: true,
    });
  }

  public closeCalendar(): void {
    this.isOpenCalendar.next({
      ...this.isOpenCalendar.value,
      isHover: false,
    });

    timer(500).subscribe(() => {
      const calendarHover = this.isOpenCalendar.value.isHover;

      if (!calendarHover) {
        this.isOpenCalendar.next({
          isTarget: false,
          isHover: false,
        });
      }
    });
  }

  public toggleCalendar(): void {
    const current = this.isOpenCalendar.value;

    this.isOpenCalendar.next({
      isTarget: !current.isTarget,
      isHover: !current.isHover,
    });
  }

  public handlePointerDown(event: PointerEvent): void {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      this.toggleCalendar();
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

  public changeTodoDate(event: {
    idTodo: string;
    buttonName: ButtonsTodoSettingsType;
    data?: Date;
  }): void {
    const { idTodo, buttonName, data } = event;
    const date = new Date();

    switch (buttonName) {
      case ButtonsTodoSettings.TODAY: {
        this.todosState
          .changeDateTodo(idTodo, date)
          .pipe(tap(() => this.changeModalOpen.emit(false)))
          .subscribe();
        break;
      }
      case ButtonsTodoSettings.TOMORROW: {
        date.setDate(date.getDate() + 1);
        this.todosState
          .changeDateTodo(idTodo, date)
          .pipe(tap(() => this.changeModalOpen.emit(false)))
          .subscribe();
        break;
      }
      case ButtonsTodoSettings.SHEDULE: {
        if (!data) return;

        console.log(data, 'dataShedule');

        this.todosState
          .changeDateTodo(idTodo, data)
          .pipe(tap(() => this.changeModalOpen.emit(false)))
          .subscribe();
        break;
      }
    }
  }
}

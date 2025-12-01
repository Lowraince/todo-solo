import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITodo, TodosService } from '../../services/todos.service';
import { CompleteIconComponent } from '../../icons/complete-icon/complete-icon.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { VideoIconComponent } from '../../icons/video-icon/video-icon.component';
import { PeachIconComponent } from '../../icons/peach-icon/peach-icon.component';
import { SettingsIconComponent } from '../../icons/settings-icon/settings-icon.component';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  Subject,
  switchMap,
} from 'rxjs';
import { ModalSettingTodoComponent } from '../modals/modal-setting-todo/modal-setting-todo.component';
import {
  ChangeDirection,
  InputIncreaseComponent,
} from '../input-increase/input-increase.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getClassPriority } from '../../utils/class-priority';
import { PriorityType } from '../../interfaces/types';

@Component({
  selector: 'app-todo',
  imports: [
    CompleteIconComponent,
    NgClass,
    VideoIconComponent,
    PeachIconComponent,
    SettingsIconComponent,
    AsyncPipe,
    ModalSettingTodoComponent,
    InputIncreaseComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent implements OnInit {
  private todoState = inject(TodosService);

  @Input({ required: true }) public todo!: ITodo;
  @Input() public dateView: boolean = true;

  @Output() public changeComplete = new EventEmitter<{
    id: string;
    complete: boolean;
  }>();

  public valueControl = new FormControl(0, { nonNullable: true });

  public isOpen$ = new BehaviorSubject<boolean>(false);
  public changePrio$ = new Subject<{
    idTodo: string;
    priority: PriorityType;
  }>();

  public ngOnInit(): void {
    this.initChangePrio();
    this.initChangeControl();
  }

  public initChangeControl(): void {
    this.valueControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(800),
        switchMap((value) => {
          const idTodo = this.todo.idTodo;

          return this.todoState.changeValueTodo(idTodo, value);
        }),
      )
      .subscribe();
  }

  public initChangePrio(): void {
    this.changePrio$
      .pipe(
        switchMap((newPrio) =>
          this.todoState.changePriorityTodo(newPrio).pipe(
            catchError((error) => {
              console.error(error, 'error change priority');

              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  public openModalTodo(): void {
    this.valueControl.setValue(this.todo.value, { emitEvent: false });
    this.isOpen$.next(true);
  }

  public closeModal(event: boolean): void {
    this.isOpen$.next(event);
  }

  public changeCompleteHandler(): void {
    const todoId = this.todo.idTodo;
    const todoComplete = !this.todo.isComplete;

    this.changeComplete.emit({ id: todoId, complete: todoComplete });
  }

  public changePriority(priority: PriorityType): void {
    this.changePrio$.next({ idTodo: this.todo.idTodo, priority });
  }

  public getFormattedDate(timeCreate: string): string {
    const todoCreateISO = timeCreate.slice(0, 10);

    if (this.formatedDateISO('today') === todoCreateISO) {
      return 'Today';
    }

    if (this.formatedDateISO('tomorrow') === todoCreateISO) {
      return 'Tomorrow';
    }

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const [, month, day] = todoCreateISO.split('-').map(Number);

    return `${day} ${months[month - 1].slice(0, 3)}.`;
  }

  public changeColorPastDate(timeCreate: string): boolean {
    const todoCreateISO = timeCreate.slice(0, 10);

    return todoCreateISO < this.formatedDateISO('today');
  }

  public getClassPriority(priority: PriorityType): string {
    return getClassPriority(priority);
  }

  public onValueChangeDirection(direction: ChangeDirection): void {
    const controlValue = this.valueControl.value;
    if (direction === 'plus') {
      if (controlValue === 1000) return;

      const formValuePlus = controlValue + 1;

      this.changeValue(formValuePlus);
    } else if (direction === 'minus') {
      if (controlValue === 0) {
        this.valueControl.setValue(0);
        return;
      }
      const formValueMinus = controlValue - 1;

      this.changeValue(formValueMinus);
    }
  }

  public onInputValueChange(input: number): void {
    this.valueControl.setValue(input);
  }

  private changeValue(value: number): void {
    this.valueControl.setValue(value);
  }

  private formatedDateISO(day: 'today' | 'tomorrow'): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    switch (day) {
      case 'today': {
        return today.toISOString().slice(0, 10);
      }
      case 'tomorrow': {
        return tomorrow.toISOString().slice(0, 10);
      }
    }
  }
}

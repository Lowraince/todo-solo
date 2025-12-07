import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
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
  tap,
} from 'rxjs';
import { ModalSettingTodoComponent } from '../modals/modal-setting-todo/modal-setting-todo.component';
import {
  ChangeDirection,
  InputIncreaseComponent,
} from '../input-increase/input-increase.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { getClassPriority } from '../../utils/class-priority';
import { PriorityType } from '../../interfaces/types';
import { formatedDateISO } from '../../utils/formated-date-iso';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private todosState = inject(TodosService);
  private destroyRef = inject(DestroyRef);

  @Input({ required: true }) public todo!: ITodo;
  @Input() public dateView: boolean = true;

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

          return this.todosState.changeValueTodo(idTodo, value);
        }),
      )
      .subscribe();
  }

  public initChangePrio(): void {
    this.changePrio$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((newPrio) =>
          this.todosState.changePriorityTodo(newPrio).pipe(
            tap(() => this.isOpen$.next(false)),
            catchError((error) => {
              console.error(error, 'error change priority');

              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  public toggleModalTodo(): void {
    this.valueControl.setValue(this.todo.value, { emitEvent: false });
    this.isOpen$.next(!this.isOpen$.value);
  }

  public closeModal(event: boolean): void {
    this.isOpen$.next(event);
  }

  public changeCompleteHandler(): void {
    const todoId = this.todo.idTodo;
    const todoComplete = !this.todo.isComplete;

    this.todosState.changeCompleteTodo(todoId, todoComplete).subscribe();
  }

  public changePriority(priority: PriorityType): void {
    this.changePrio$.next({ idTodo: this.todo.idTodo, priority });
  }

  public getFormattedDate(timeCreate: string): string {
    const todoCreateISO = timeCreate.slice(0, 10);

    if (formatedDateISO('today') === todoCreateISO) {
      return 'Today';
    }

    if (formatedDateISO('tomorrow') === todoCreateISO) {
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

    return todoCreateISO < formatedDateISO('today');
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
}

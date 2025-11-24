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
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap } from 'rxjs';
import { ModalSettingTodoComponent } from '../modals/modal-setting-todo/modal-setting-todo.component';
import { InputIncreaseComponent } from '../input-increase/input-increase.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PriorityType } from '../../interfaces/enums';
import { getClassPriority } from '../../utils/class-priority';

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

  public todoData: string = '';
  public valueControl = new FormControl(0);

  public isOpen$ = new BehaviorSubject<boolean>(false);
  public changePrio$ = new Subject<{
    idTodo: string;
    priority: PriorityType;
  }>();

  public ngOnInit(): void {
    this.todoData = this.getFormattedDate(this.todo.timeToCreate);
    this.initValueControl();
    this.initChangePrio();
  }

  public initValueControl(): void {
    this.valueControl.setValue(this.todo.value);
  }

  public initChangePrio(): void {
    console.log();
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
    const dataCreateISO = timeCreate.slice(0, 10);

    const today1 = new Date();
    const tomorrow1 = new Date(today1);
    tomorrow1.setDate(today1.getDate() + 1);

    const todayISO = today1.toISOString().slice(0, 10);
    const tomorrowISO = tomorrow1.toISOString().slice(0, 10);

    if (todayISO === dataCreateISO) {
      return 'Today';
    }

    if (tomorrowISO === dataCreateISO) {
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

    const [, month, day] = dataCreateISO.split('-').map(Number);

    return `${day} ${months[month - 1].slice(0, 3)}.`;
  }

  public getClassPriority(priority: PriorityType): string {
    return getClassPriority(priority);
  }
}

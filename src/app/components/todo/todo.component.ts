import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ITodo } from '../../services/todos.service';
import { CompleteIconComponent } from '../../icons/complete-icon/complete-icon.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { VideoIconComponent } from '../../icons/video-icon/video-icon.component';
import { PeachIconComponent } from '../../icons/peach-icon/peach-icon.component';
import { SettingsIconComponent } from '../../icons/settings-icon/settings-icon.component';
import { ModalsOpenService } from '../../services/modals-open.service';
import { BehaviorSubject, map } from 'rxjs';
import { ModalSettingTodoComponent } from '../modals/modal-setting-todo/modal-setting-todo.component';
import { InputIncreaseComponent } from '../input-increase/input-increase.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
  @Input({ required: true }) public todo!: ITodo;
  @Input() public dateView: boolean = true;

  @Output() public changeComplete = new EventEmitter<{
    id: string;
    complete: boolean;
  }>();

  public todoData: string = '';
  public valueControl = new FormControl(0);

  private openModalService = inject(ModalsOpenService);

  public isOpenModal = this.openModalService.modalsState$.pipe(
    map((state) => state.settingsTodoModal),
  );

  public isOpen$ = new BehaviorSubject<boolean>(false);

  public ngOnInit(): void {
    this.todoData = this.getFormattedDate(this.todo.timeToCreate);
    this.initValueControl();
  }

  public initValueControl(): void {
    this.valueControl.setValue(this.todo.value);
  }

  public openModalTodo(): void {
    this.isOpen$.next(true);
    // this.openModalService.openModal('settingsTodoModal');
  }

  public closeModal(event: boolean): void {
    this.isOpen$.next(event);
  }

  public changeCompleteHandler(): void {
    const todoId = this.todo.idTodo;
    const todoComplete = !this.todo.isComplete;

    this.changeComplete.emit({ id: todoId, complete: todoComplete });
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
}

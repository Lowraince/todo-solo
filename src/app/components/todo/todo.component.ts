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
import { map } from 'rxjs';
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

  public ngOnInit(): void {
    this.todoData = this.getFormattedDate(this.todo.timeToCreate);
    this.test();
  }

  public test(): void {
    this.valueControl.setValue(this.todo.value);
  }

  public openModalTodo(): void {
    this.openModalService.openModal('settingsTodoModal');
  }

  public changeCompleteHandler(): void {
    const todoId = this.todo.idTodo;
    const todoComplete = !this.todo.isComplete;

    this.changeComplete.emit({ id: todoId, complete: todoComplete });
  }

  public getFormattedDate(timeCreate: string): string {
    const [day, month, year] = timeCreate.split(', ').map(Number);
    const todoDate = new Date(year, month - 1, day);

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isDateEqual(todoDate, today)) {
      return 'Today';
    }

    if (this.isDateEqual(todoDate, tomorrow)) {
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

    return `${day} ${months[month - 1]}`;
  }

  private isDateEqual(date: Date, targetDate: Date): boolean {
    return (
      date.getDate() === targetDate.getDate() &&
      date.getMonth() === targetDate.getMonth() &&
      date.getFullYear() === targetDate.getFullYear()
    );
  }
}

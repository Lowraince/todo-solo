import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../../services/todos.service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { TodoComponent } from '../../../../components/todo/todo.component';
import { SettingsService } from '../../../../services/settings.service';

@Component({
  selector: 'app-main-content-todos',
  imports: [AsyncPipe, TodoComponent, NgClass],
  templateUrl: './main-content-todos.component.html',
  styleUrl: './main-content-todos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentTodosComponent {
  private todosState = inject(TodosService);
  private settingsState = inject(SettingsService);

  public showTodosComplete: boolean = true;

  private timerDurationSetting$ = this.settingsState.settingsState$.pipe(
    map((state) => state.timer.timeDuration),
  );

  public todos$ = this.todosState.todoState$.pipe(map((state) => state.todos));
  public isEmptyTodos$ = this.todos$.pipe(map((todos) => todos?.length === 0));

  public todosComplete$ = this.todos$.pipe(
    map((todos) => todos.filter((todo) => todo.isComplete)),
  );

  public todosUncomplete$ = this.todos$.pipe(
    map((todos) => todos.filter((todo) => !todo.isComplete)),
  );

  // public todosValueTime$ = combineLatest([
  //   this.timerDurationSetting$,
  //   this.todosUncomplete$.pipe(filter((todos) => todos && todos.length > 0)),
  // ]).pipe(
  //   tap(([time, uncompleteTodos]) =>
  //     console.log(`${time} - "Время"`, `${uncompleteTodos} - todos`),
  //   ),
  //   map(([time, uncompleteTodos]) => {
  //     return uncompleteTodos.reduce((accumulator, current) => {
  //       return accumulator + current.value * Number(time);
  //     }, 0);
  //   }),
  // );

  public isEmptyOrUncomplete = combineLatest([
    this.todos$,
    this.todosUncomplete$,
  ]).pipe(
    map(([todos, uncomplete]) => todos.length === 0 || uncomplete.length === 0),
  );

  public showTodosCompleteHanlder(): void {
    this.showTodosComplete = !this.showTodosComplete;
  }

  public isShowTodosComplete(): string {
    return this.showTodosComplete
      ? 'Hide completed tasks'
      : 'Show completed tasks';
  }

  public changeComplete({
    id,
    complete,
  }: {
    id: string;
    complete: boolean;
  }): void {
    this.todosState.changeCompleteTodo(id, complete).subscribe();
  }
}

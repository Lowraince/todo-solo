import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ITodo, TodosService } from '../../../../services/todos.service';
import { combineLatest, filter, map } from 'rxjs';
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

  public isTodosSortPrio = this.todosState.todoState$.pipe(
    map((state) => state.sort === 'priority_order'),
  );

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

  public todosUncompletePrioWithTime$ = combineLatest([
    this.todos$,
    this.timerDurationSetting$,
  ]).pipe(
    filter(
      ([todos, timeDuration]) => todos.length > 0 && timeDuration !== null,
    ),
    map(([todos, timeDuration]) => {
      const uncompleteTodos = todos.filter((todo) => !todo.isComplete);

      const noPrio = uncompleteTodos.filter(
        (todo) => todo.priority === 'No priority',
      );
      const lowPrio = uncompleteTodos.filter(
        (todo) => todo.priority === 'Low priority',
      );
      const mediumPrio = uncompleteTodos.filter(
        (todo) => todo.priority === 'Medium priority',
      );
      const highPrio = uncompleteTodos.filter(
        (todo) => todo.priority === 'High priority',
      );
      const calculateTime = (todoList: ITodo[]): string => {
        const minsSum = todoList.reduce(
          (accumulator, current) =>
            accumulator + current.value * Number(timeDuration),
          0,
        );
        const hours = Math.floor(minsSum / 60);
        const minutes = minsSum % 60;

        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      };

      return [
        {
          key: 'High priority',
          value: highPrio,
          time: calculateTime(highPrio),
        },
        {
          key: 'Medium priority',
          value: mediumPrio,
          time: calculateTime(mediumPrio),
        },
        {
          key: 'Low priority',
          value: lowPrio,
          time: calculateTime(lowPrio),
        },
        {
          key: 'No priority',
          value: noPrio,
          time: calculateTime(noPrio),
        },
      ];
    }),
  );

  public todosAndEstimatedTime$ = combineLatest([
    this.todos$,
    this.timerDurationSetting$,
  ]).pipe(
    filter(
      ([todos, timeDuration]) => todos.length > 0 && timeDuration !== null,
    ),
    map(([todos, timeDuration]) => {
      const uncompleteTodos = todos.filter((todo) => !todo.isComplete);

      const minsSum = uncompleteTodos.reduce(
        (accumulator, current) =>
          accumulator + current.value * Number(timeDuration),
        0,
      );

      const hours = Math.floor(minsSum / 60);
      const minutes = minsSum % 60;

      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }),
  );

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

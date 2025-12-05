import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../../services/todos.service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { TodoComponent } from '../../../../components/todo/todo.component';
import { SettingsService } from '../../../../services/settings.service';
import { TodosListSectionComponent } from '../../../../components/todos-list-section/todos-list-section.component';
import { calculateTime } from '../../../../utils/calculate-time';

@Component({
  selector: 'app-main-content-todos',
  imports: [AsyncPipe, TodoComponent, NgClass, TodosListSectionComponent],
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

      return [
        {
          key: 'High priority',
          value: highPrio,
          time: calculateTime(highPrio, timeDuration),
        },
        {
          key: 'Medium priority',
          value: mediumPrio,
          time: calculateTime(mediumPrio, timeDuration),
        },
        {
          key: 'Low priority',
          value: lowPrio,
          time: calculateTime(lowPrio, timeDuration),
        },
        {
          key: 'No priority',
          value: noPrio,
          time: calculateTime(noPrio, timeDuration),
        },
      ];
    }),
  );

  public todosAndEstimatedTime$ = combineLatest([
    this.todos$,
    this.timerDurationSetting$,
  ]).pipe(
    map(([todos, timeDuration]) => {
      const uncompleteTodos = todos.filter((todo) => !todo.isComplete);

      return calculateTime(uncompleteTodos, timeDuration);
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
}

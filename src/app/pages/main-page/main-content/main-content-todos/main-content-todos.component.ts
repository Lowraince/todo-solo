import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodosService } from '../../../../services/todos.service';
import { combineLatest, map } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { TodoComponent } from '../../../../components/todo/todo.component';
import { SettingsService } from '../../../../services/settings.service';
import { TodosListSectionComponent } from '../../../../components/todos-list-section/todos-list-section.component';
import { calculateTime } from '../../../../utils/calculate-time';
import { DateGroupMapSort, DateGroupSort } from '../../../../interfaces/types';

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

  public activeSidebar$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public activeSorting$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSort),
  );

  public isEmptyUncompleteAndAllSidebar$ = combineLatest([
    this.todosUncomplete$,
    this.activeSidebar$,
  ]).pipe(
    map(
      ([todosUncomplete, activeSidebar]) =>
        todosUncomplete.length > 0 && activeSidebar !== 'all tasks',
    ),
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

  public todosForDataSort$ = combineLatest([
    this.todos$,
    this.timerDurationSetting$,
  ]).pipe(
    map(([todos, timeDuration]) => {
      const uncompleteTodos = todos.filter((todo) => !todo.isComplete);

      const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

      const todosMap = new Map<string, DateGroupMapSort>();

      for (const todo of uncompleteTodos) {
        const timeSlice = new Date(todo.timeToCreate);
        const dataString = `${dayOfWeek[timeSlice.getDay()]}, ${timeSlice.getDate()} ${months[timeSlice.getMonth()].slice(0, 3)}`;
        if (!todosMap.has(dataString)) {
          todosMap.set(dataString, {
            date: dataString,
            todos: [],
          });
        }

        const dateGroup = todosMap.get(dataString)!;
        dateGroup.todos.push(todo);
      }

      const dateGroupWithTime = this.transformToDateGroupsWithTime(
        todosMap,
        timeDuration,
      );

      return dateGroupWithTime;
    }),
  );

  private transformToDateGroupsWithTime(
    todosMap: Map<string, DateGroupMapSort>,
    timeDuration: string,
  ): DateGroupSort[] {
    return [...todosMap.values()].map((dateGroup) => {
      const timeTest = calculateTime(dateGroup.todos, timeDuration);

      return {
        date: dateGroup.date,
        todos: [...dateGroup.todos],
        time: timeTest,
      };
    });
  }

  public todosAndEstimatedTime$ = combineLatest([
    this.todos$,
    this.timerDurationSetting$,
  ]).pipe(
    map(([todos, timeDuration]) => {
      const uncompleteTodos = todos.filter((todo) => !todo.isComplete);

      return calculateTime(uncompleteTodos, timeDuration);
    }),
  );

  public isEmptyOrUncomplete$ = combineLatest([
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

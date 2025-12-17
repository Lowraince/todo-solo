import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TodosService } from '../../../services/todos.service';
import { BehaviorSubject, combineLatest, filter, map, switchMap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { SortIconComponent } from '../../../icons/sort-icon/sort-icon.component';
import { MainContentFormInputComponent } from './main-content-form-input/main-content-form-input.component';
import { MainContentTodosComponent } from './main-content-todos/main-content-todos.component';
import { ModalErrorComponent } from '../../../components/modals/modal-error/modal-error.component';
import { ActivatedRoute } from '@angular/router';
import { SidebarItemsType } from '../../../interfaces/types';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { ModalSortComponent } from '../../../components/modals/modal-sort/modal-sort.component';
import { SettingsService } from '../../../services/settings.service';
import { MainContentQuantityComponent } from './main-content-quantity/main-content-quantity.component';
import { MainContentTimeComponent } from './main-content-time/main-content-time.component';
import { sumMinutes } from '../../../utils/sum-mins';

@Component({
  selector: 'app-main-content',
  imports: [
    AsyncPipe,
    SortIconComponent,
    MainContentFormInputComponent,
    MainContentTodosComponent,
    ModalErrorComponent,
    CapitalizePipe,
    ModalSortComponent,
    MainContentQuantityComponent,
    MainContentTimeComponent,
    NgClass,
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentComponent implements OnInit {
  private todosState = inject(TodosService);
  private route = inject(ActivatedRoute);
  private settingsState = inject(SettingsService);

  private todos$ = this.todosState.todoState$.pipe(map((state) => state.todos));

  private isOpenSort = new BehaviorSubject<boolean>(false);

  public isOpenSort$ = this.isOpenSort.asObservable();

  public todoActiveLink$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSidebarItem),
  );

  public todoActiveisMissed$ = this.todosState.todoState$.pipe(
    map((state) => state.activeSidebarItem === 'missed'),
  );

  private timerDuration$ = this.settingsState.settingsState$.pipe(
    map((state) => state.timer.timeDuration),
  );

  public todoComplete$ = this.todosState.todoState$.pipe(
    map((state) => state.todos.filter((todo) => todo.isComplete).length),
  );

  public todoUncomplete$ = this.todosState.todoState$.pipe(
    map((state) => state.todos.filter((todo) => !todo.isComplete)),
  );

  public todosAndEstimatedTime$ = combineLatest([
    this.todos$,
    this.timerDuration$,
  ]).pipe(
    filter(([, timeDuration]) => timeDuration !== null),
    map(([todos, timeDuration]) => {
      const uncompleteTodos = todos.filter((todo) => !todo.isComplete);

      return sumMinutes(uncompleteTodos, timeDuration);
    }),
  );

  public todosAndSpentTime$ = combineLatest([
    this.todos$,
    this.timerDuration$,
  ]).pipe(
    filter(
      ([todos, timeDuration]) => todos.length > 0 && timeDuration !== null,
    ),
    map(([todos, timeDuration]) => {
      return sumMinutes(todos, timeDuration, true);
    }),
  );

  public todoUncompleteLength$ = this.todosState.todoState$.pipe(
    map((state) => state.todos.filter((todo) => !todo.isComplete).length),
  );

  public todoErrors$ = this.todosState.todoState$.pipe(
    map((state) => state.errorMessages),
  );

  public ngOnInit(): void {
    this.initGetTodos();
  }

  private initGetTodos(): void {
    this.route.paramMap
      .pipe(
        map((parameterMap) => parameterMap.get('todosDay')),
        filter((day): day is SidebarItemsType => day !== null),
        switchMap((day) => this.todosState.loadTodos(day)),
      )
      .subscribe();
  }

  public toggleOpenModal(): void {
    this.isOpenSort.next(!this.isOpenSort.value);
  }

  public closeModal(): void {
    this.isOpenSort.next(false);
  }
}

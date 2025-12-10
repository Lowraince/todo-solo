import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  tap,
  throwError,
  timer,
} from 'rxjs';
import {
  PriorityType,
  SidebarItemsType,
  SortItemsType,
} from '../interfaces/types';
import {
  PriorityTodos,
  SidebarItems,
  SortItems,
  SortTitles,
} from '../interfaces/enums';
import { ApiService } from './api.service';

export interface SidebarItemsState {
  title: SidebarItemsType;
  isActive: boolean;
}

export interface SortItemsState {
  title: SortTitles;
  sorting: SortItems;
}

export interface ITodo {
  idTodo: string;
  value: number;
  valueComplete: number;
  description: string;
  timeToCreate: string;
  isComplete: boolean;
  priority: PriorityType;
  timeSpent: number;
}

export type ITodoCome = Pick<ITodo, 'description' | 'value'>;
export type ITodoAdd = Omit<ITodo, 'idTodo' | 'isComplete'>;

interface TodosState {
  sidebarItems: SidebarItemsState[];
  sortingItems: SortItemsState[];
  todos: ITodo[];
  activeSidebarItem: SidebarItemsType | null;
  activeSort: SortItemsType;
  errorMessages: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private apiService = inject(ApiService);

  private todoState = new BehaviorSubject<TodosState>({
    sidebarItems: [
      { title: SidebarItems.TODAY, isActive: true },
      { title: SidebarItems.TOMORROW, isActive: true },
      { title: SidebarItems.MISSED, isActive: true },
      { title: SidebarItems.FOR_WEEK, isActive: true },
      { title: SidebarItems.ALL, isActive: true },
    ],
    sortingItems: [
      {
        title: SortTitles.BY_TASKS,
        sorting: SortItems.PROJECT_SORT,
      },

      { title: SortTitles.BY_PRIORITY, sorting: SortItems.PRIORITY_SORT },

      { title: SortTitles.BY_DATE, sorting: SortItems.DATE_SORT },
    ],
    activeSidebarItem: null,
    todos: [],
    activeSort: SortItems.PROJECT_SORT,
    errorMessages: [],
  });

  public todoState$ = this.todoState.asObservable();

  public addTodo({
    description,
    value,
    activeSidebar,
  }: {
    description: string;
    value: number;
    activeSidebar: SidebarItemsType;
  }): Observable<ITodo> {
    let presentTime = new Date();

    if (activeSidebar === 'tomorrow') {
      presentTime = this.nextDay(presentTime);
    } else if (activeSidebar === 'for this week') {
      presentTime = this.endOfWeek(presentTime);
    }

    const newTodo: ITodoAdd = {
      value,
      valueComplete: 0,
      description,
      timeToCreate: presentTime.toISOString(),
      timeSpent: 0,
      priority: PriorityTodos.NO_PRIO,
    };

    const currentState = this.todoState.value;

    return this.apiService.postDataTodo(newTodo).pipe(
      tap((todo) => {
        this.todoState.next({
          ...currentState,
          todos: [...currentState.todos, todo],
        });
      }),
    );
  }

  public loadTodos(active: SidebarItemsType): Observable<ITodo[]> {
    return this.apiService.getDataTodo(active).pipe(
      tap((todos: ITodo[]) => {
        const currentState = this.todoState.value;

        const activeSort =
          active === 'today' ||
          (active === 'tomorrow' && currentState.activeSort === 'date_order')
            ? 'project_order'
            : currentState.activeSort;

        this.todoState.next({
          ...currentState,
          activeSidebarItem: active,
          todos: todos,
          activeSort,
        });
      }),
    );
  }

  public changePriorityTodo({
    idTodo,
    priority,
  }: {
    idTodo: string;
    priority: PriorityType;
  }): Observable<ITodo> {
    return Math.random() > 0.5
      ? throwError(() => {
          const currentState = this.todoState.value;

          this.todoState.next({
            ...currentState,
            errorMessages: [
              ...currentState.errorMessages,
              'Failed to update task priority',
            ],
          });

          timer(2000).subscribe(() => {
            this.todoState.next({
              ...this.todoState.value,
              errorMessages: this.todoState.value.errorMessages.filter(
                (errorMessage) =>
                  errorMessage !== 'Failed to update task priority',
              ),
            });
          });

          return new Error('Simulated fail');
        })
      : this.apiService.patchDataTodo(idTodo, { priority }).pipe(
          tap((newTodo) => {
            this.todoState.next({
              ...this.todoState.value,
              todos: this.todoState.value.todos.map((todo) => {
                if (todo.idTodo === idTodo) {
                  return newTodo;
                }

                return todo;
              }),
            });
          }),
        );
  }

  public deleteTodo(idTodo: string): Observable<{ success: true }> {
    return this.apiService.deleteDataTodo(idTodo).pipe(
      tap(() => {
        const currentState = this.todoState.value;

        this.todoState.next({
          ...currentState,
          todos: currentState.todos.filter((todo) => todo.idTodo !== idTodo),
        });
      }),
    );
  }

  public changeValueTodo(idTodo: string, value: number): Observable<ITodo> {
    return this.apiService.patchDataTodo(idTodo, { value }).pipe(
      tap((newTodo) => {
        const currentState = this.todoState.value;

        this.todoState.next({
          ...currentState,
          todos: currentState.todos.map((todo) => {
            if (todo.idTodo === newTodo.idTodo) {
              return newTodo;
            }

            return todo;
          }),
        });
      }),
    );
  }

  public changeVisibleSidebar({ title, isActive }: SidebarItemsState): void {
    this.todoState.next({
      ...this.todoState.value,
      sidebarItems: this.todoState.value.sidebarItems.map((item) => {
        if (item.title === title) {
          return {
            ...item,
            isActive,
          };
        }

        return item;
      }),
    });
  }

  public changeCompleteTodo(
    idTodo: string,
    complete: boolean,
  ): Observable<ITodo> {
    return this.apiService.patchDataTodo(idTodo, { isComplete: complete }).pipe(
      tap((newTodo) => {
        const currentState = this.todoState.value;

        this.todoState.next({
          ...currentState,
          todos: currentState.todos.map((todo) => {
            if (todo.idTodo === newTodo.idTodo) {
              return newTodo;
            }

            return todo;
          }),
        });
      }),
    );
  }

  public changeDateTodo(idTodo: string, newDate: Date): Observable<ITodo[]> {
    console.log('changeDate', newDate.toISOString());
    const test = new Date(
      newDate.getUTCFullYear(),
      newDate.getUTCMonth(),
      newDate.getUTCDate(),
      12,
      0,
      0,
    ).toISOString();
    return this.apiService.patchDataTodo(idTodo, { timeToCreate: test }).pipe(
      switchMap(() => {
        const currentState = this.todoState.value;

        return this.loadTodos(currentState.activeSidebarItem!);
      }),
    );
  }

  public changeSortTodos(activeSort: SortItemsType): void {
    const currentState = this.todoState.value;

    this.todoState.next({
      ...currentState,
      activeSort,
    });
  }

  private nextDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  private endOfWeek(date: Date): Date {
    const currentDay = date.getDay();
    const daysUntilSunday = 7 - currentDay;

    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + daysUntilSunday);

    return endOfWeek;
  }
}

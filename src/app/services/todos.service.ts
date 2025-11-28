import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError, timer } from 'rxjs';
import { SidebarItems, SortTodos } from '../interfaces/types';
import { PriorityTodos, PriorityType } from '../interfaces/enums';
import { ApiService } from './api.service';

export interface SidebarItemsState {
  title: SidebarItems;
  isActive: boolean;
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
  todos: ITodo[];
  activeSidebarItem: SidebarItems;
  sort: SortTodos;
  errorMessages: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private apiService = inject(ApiService);

  private todoState = new BehaviorSubject<TodosState>({
    sidebarItems: [
      { title: 'Today', isActive: true },
      { title: 'Tomorrow', isActive: true },
      { title: 'Missed', isActive: true },
      { title: 'For this week', isActive: true },
    ],
    activeSidebarItem: 'Today',
    todos: [],
    sort: 'project_order',
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
    activeSidebar: SidebarItems;
  }): Observable<ITodo> {
    let presentTime = new Date();

    if (activeSidebar === 'Tomorrow') {
      presentTime = this.nextDay(presentTime);
    } else if (activeSidebar === 'For this week') {
      console.log('for this week');
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

  public getTodos(active: string): Observable<ITodo[]> {
    return this.apiService.getDataTodo(active).pipe(
      tap((todos: ITodo[]) => {
        const currentState = this.todoState.value;
        this.todoState.next({
          ...currentState,
          todos: todos,
        });
      }),
    );
  }

  public changeSidebarItem(activeSidebarItem: SidebarItems): void {
    this.todoState.next({
      ...this.todoState.value,
      activeSidebarItem,
    });
  }

  public changePriorityTodo({
    idTodo,
    priority,
  }: {
    idTodo: string;
    priority: PriorityType;
  }): Observable<ITodo> {
    const currentState = this.todoState.value;

    return Math.random() > 0.5
      ? throwError(() => {
          this.todoState.next({
            ...currentState,
            errorMessages: [
              ...currentState.errorMessages,
              'Failed to update task priority',
            ],
          });

          timer(2000).subscribe(() => {
            this.todoState.next({
              ...currentState,
              errorMessages: currentState.errorMessages.filter(
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
              ...currentState,
              todos: currentState.todos.map((todo) => {
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
            isActive: !isActive,
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

  private nextDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }
}

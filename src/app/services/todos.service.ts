import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
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
  });

  public todoState$ = this.todoState.asObservable();

  public addTodo({
    description,
    value,
  }: {
    description: string;
    value: number;
  }): Observable<ITodoAdd> {
    const presentTime = `${new Date().getDate()}, ${
      new Date().getMonth() + 1
    }, ${new Date().getFullYear()}`;

    const newTodo: ITodoAdd = {
      value,
      valueComplete: 0,
      description,
      timeToCreate: presentTime,
      timeSpent: 0,
      priority: PriorityTodos.NO_PRIO,
    };

    const currentState = this.todoState.value;

    return this.apiService.postDataTodo(newTodo).pipe(
      tap((todo) => {
        console.log(todo, 'todo');
        this.todoState.next({
          ...currentState,
          todos: [...currentState.todos, todo],
        });

        console.log(this.todoState);
      }),
    );
  }

  public getTodos(): void {
    const currentState = this.todoState.value;

    this.apiService
      .getDataTodo()
      .pipe(
        tap((todos: ITodo[]) => {
          console.log(todos, 'todos');
          this.todoState.next({
            ...currentState,
            todos: todos,
          });
        }),
        take(1),
      )
      .subscribe();
  }

  public changeSidebarItem(activeSidebarItem: SidebarItems): void {
    this.todoState.next({
      ...this.todoState.value,
      activeSidebarItem,
    });
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

  public changeCompleteTodo(id: string, complete: boolean): void {
    const todo = this.todoState.value.todos.map((todo) => {
      if (todo.idTodo === id) {
        return {
          ...todo,
          isComplete: complete,
        };
      }

      return todo;
    });

    this.todoState.next({
      ...this.todoState.value,
      todos: todo,
    });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarItems, SortTodos } from '../interfaces/types';
import { PriorityTodos, PriorityType } from '../interfaces/enums';

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

  public addTodo({ value, description }: ITodoCome): void {
    const presentTime = `${new Date().getDate()}, ${
      new Date().getMonth() + 1
    }, ${new Date().getFullYear()}`;

    const newTodo: ITodo = {
      idTodo: crypto.randomUUID(),
      value,
      valueComplete: 0,
      description,
      timeToCreate: presentTime,
      isComplete: false,
      timeSpent: 0,
      priority: PriorityTodos.NO_PRIO,
    };

    const currentState = this.todoState.value;

    console.log(newTodo);

    this.todoState.next({
      ...currentState,
      todos: [...currentState.todos, newTodo],
    });
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

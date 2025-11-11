import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PriorityTodos, SidebarItems, SortTodos } from '../interfaces/types';

export interface SidebarItemsState {
  title: SidebarItems;
  isActive: boolean;
}

interface ITodo {
  idTodo: string;
  pomodoroValue: number;
  description: string;
  timeCreate: string;
  isComplete: boolean;
  priority: PriorityTodos;
  pomodoroValueComplete: number;
  timeSpent: number;
}

interface TodosState {
  sidebarItems: SidebarItemsState[];
  todos: ITodo[] | null;
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
    todos: null,
    sort: 'project_order',
  });

  public todoState$ = this.todoState.asObservable();

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
}

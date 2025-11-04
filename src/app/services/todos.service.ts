import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarItems } from '../interfaces/types';

export interface SidebarItemsState {
  title: SidebarItems;
  active: boolean;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  sidebarItems: SidebarItemsState[];
  todos: Todo[] | null;
  activeSidebarItem: SidebarItems;
  sort: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private todoState = new BehaviorSubject<TodosState>({
    sidebarItems: [
      { title: 'Today', active: true },
      { title: 'Tomorrow', active: true },
      { title: 'Missed', active: true },
      { title: 'For this week', active: true },
    ],
    activeSidebarItem: 'Today',
    todos: null,
    sort: 'asc',
  });

  public todoState$ = this.todoState.asObservable();

  public changeSidebarItem(activeSidebarItem: SidebarItems): void {
    this.todoState.next({
      ...this.todoState.value,
      activeSidebarItem,
    });
  }

  public changeVisibleSidebar({ title, active }: SidebarItemsState): void {
    this.todoState.next({
      ...this.todoState.value,
      sidebarItems: this.todoState.value.sidebarItems.map((item) => {
        if (item.title === title) {
          return {
            ...item,
            active: !active,
          };
        }

        return item;
      }),
    });
  }
}

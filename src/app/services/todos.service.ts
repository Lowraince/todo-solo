import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarItems } from '../interfaces/types';

export interface SidebarItemsState {
  title: SidebarItems;
  isActive: boolean;
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
      { title: 'Today', isActive: true },
      { title: 'Tomorrow', isActive: true },
      { title: 'Missed', isActive: true },
      { title: 'For this week', isActive: true },
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

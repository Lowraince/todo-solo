import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodosState {
  sidebarItems: string[];
  todos: Todo[] | null;
  sort: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private todoState = new BehaviorSubject<TodosState>({
    sidebarItems: ['Today', 'Tomorrow', 'Missed', 'For this week'],
    todos: null,
    sort: 'asc',
  });

  public todoState$ = this.todoState.asObservable();
}

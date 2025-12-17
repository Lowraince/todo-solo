import { inject, Injectable } from '@angular/core';
import { ITodo } from './todos.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SidebarItemsType } from '../interfaces/types';
import { ApiService } from './api.service';

interface TimerState {
  activeTodo: null | ITodo;
  todos: ITodo[] | [];
  timeDuration: string;
  timeRest: string;
  canvasHeight: number;
  canvasWidth: number;
}

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timerState = new BehaviorSubject<TimerState>({
    activeTodo: null,
    todos: [],
    timeDuration: '',
    timeRest: '',
    canvasHeight: 400,
    canvasWidth: 400,
  });

  public timerState$ = this.timerState.asObservable();

  private apiService = inject(ApiService);

  public addActiveTodo(todo: ITodo): void {
    this.timerState.next({
      ...this.timerState.value,
      activeTodo: todo,
    });
  }

  public addTime(timeDuration: string, timeRest: string): void {
    this.timerState.next({
      ...this.timerState.value,
      timeDuration,
      timeRest,
    });
  }

  public clearActiveTodo(): void {
    this.timerState.next({
      ...this.timerState.value,
      activeTodo: null,
    });
  }

  public loadTodos(active: SidebarItemsType): Observable<ITodo[]> {
    return this.apiService.getDataTodo(active).pipe(
      tap((todos: ITodo[]) => {
        const currentState = this.timerState.value;

        this.timerState.next({
          ...currentState,
          todos: todos,
        });
      }),
    );
  }
}

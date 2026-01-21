import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SidebarItemsType } from '../interfaces/types';
import { ApiService } from './api.service';
import { ITodo } from '../interfaces/interface';

interface TimerState {
  activeTodo: null | ITodo;
  todos: ITodo[] | [];
  timeDuration: string;
  timeRest: string;
  focusTime: 'focus' | 'rest';
  isStart: boolean;
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
    focusTime: 'focus',
    isStart: false,
  });

  public timerState$ = this.timerState.asObservable();

  private apiService = inject(ApiService);

  public addActiveTodo(todo: ITodo): void {
    this.timerState.next({
      ...this.timerState.value,
      activeTodo: todo,
    });
  }

  public startTimer(): void {
    this.timerState.next({
      ...this.timerState.value,
      isStart: true,
    });
  }

  public stopTimer(): void {
    this.timerState.next({
      ...this.timerState.value,
      isStart: false,
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

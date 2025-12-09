import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ITodo, TodosService } from '../../services/todos.service';
import {
  CalendarDayTypes,
  CalendarService,
} from '../../services/calendar.service';
import { map, take, tap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [AsyncPipe, NgClass],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  @Input({ required: true }) public todo!: ITodo;

  private todosState = inject(TodosService);
  private calendarState = inject(CalendarService);

  public selectedDate$ = this.calendarState.calendarState$.pipe(
    map((state) => {
      return state.selectedDate?.toLocaleString('En-en', {
        month: 'long',
        year: 'numeric',
      });
    }),
  );

  public daysOfWeek$ = this.calendarState.calendarState$.pipe(
    map((state) => state.daysOfWeek),
  );

  public calendarDays$ = this.calendarState.calendarState$.pipe(
    map((state) => state.calendarDays),
  );

  public ngOnInit(): void {
    this.calendarState.createCalendar(new Date('2025-12-15T15:24:17.609Z'));
  }

  public activeDay(date: Date): boolean {
    const dateCalendar = date.toISOString().slice(0, 10);
    const dateTodo = this.todo.timeToCreate.slice(0, 10);

    return dateCalendar === dateTodo ? true : false;
  }

  public isPrevOrNext(type: CalendarDayTypes): boolean {
    return type === 'next' || type === 'prev' ? true : false;
  }

  public monthHandler(type: 'prev' | 'next'): void {
    this.calendarState.calendarState$
      .pipe(
        take(1),
        tap((state) => {
          if (!state.selectedDate) return;

          const date = new Date(state.selectedDate);

          if (type === 'prev') {
            date.setMonth(date.getMonth() - 1);
          } else if (type === 'next') {
            date.setMonth(date.getMonth() + 1);
          }

          this.calendarState.createCalendar(date);
        }),
      )
      .subscribe();
  }

  // public changeTodoData(idTodo: string, data: Date): void {

  // }
}

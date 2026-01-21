import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  CalendarDayTypes,
  CalendarService,
} from '../../services/calendar.service';
import { map, take, tap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { ButtonsTodoSettingsType } from '../../interfaces/types';
import { ITodo } from '../../interfaces/interface';

@Component({
  selector: 'app-calendar',
  imports: [AsyncPipe, NgClass],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) public todo!: ITodo;

  @Output() public todoDataChange = new EventEmitter<{
    idTodo: string;
    data: Date;
    buttonName: ButtonsTodoSettingsType;
  }>();

  private calendarState = inject(CalendarService);
  private element = inject(ElementRef<HTMLElement>);
  private initialDocumentHeight = 0;

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
    this.calendarState.createCalendar(new Date(this.todo.timeToCreate));

    this.initialDocumentHeight = document.documentElement.scrollHeight;
  }

  public ngAfterViewInit(): void {
    const element = this.element.nativeElement;
    const rect = element.getBoundingClientRect();

    const elementBottom = rect.bottom + window.scrollY;
    const overflow = elementBottom - this.initialDocumentHeight;

    console.log(overflow, 'cal');
    console.log(`translateY(-${overflow}px)`, 'cal');

    if (overflow >= -210) {
      console.log('yes');
      element.style.transform = `translateY(${overflow + 70}px)`;
    }
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

  public changeTodoData(data: Date): void {
    const idTodo = this.todo.idTodo;

    this.todoDataChange.emit({ idTodo, data, buttonName: 'schedule date' });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CalendarDay {
  day: number;
  type: 'prev' | 'current' | 'next';
  fullDate: Date;
}

export type CalendarDayTypes = CalendarDay['type'];

type DaysOfWeekType = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CalendarState {
  daysOfWeek: DaysOfWeekType;
  calendarDays: CalendarDay[] | [];
  selectedDate: Date | null;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private calendarState = new BehaviorSubject<CalendarState>({
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    calendarDays: [],
    selectedDate: null,
  });

  public calendarState$ = this.calendarState.asObservable();

  public createCalendar(date: Date): void {
    const year = date.getFullYear();
    const month = date.getMonth();

    const getDaysInMonth = this.daysInMonth(year, month);

    const firstDayofMonth = new Date(year, month, 1);
    const firstDayofWeek = firstDayofMonth.getDay();

    const calendarDaysPrevious = this.getCalendarPrev(
      year,
      month,
      firstDayofWeek,
    );

    const calendarDaysCurrent: CalendarDay[] = this.cycleCalendarDays(
      1,
      getDaysInMonth,
      'current',
      year,
      month,
    );

    const previousCurrentDaysLength =
      calendarDaysPrevious.length + calendarDaysCurrent.length;

    const calendarDaysNext = this.getCalendarNext(
      year,
      month,
      previousCurrentDaysLength,
    );

    const calendarDays: CalendarDay[] = [
      ...calendarDaysPrevious,
      ...calendarDaysCurrent,
      ...calendarDaysNext,
    ];

    this.calendarState.next({
      ...this.calendarState.value,
      selectedDate: date,
      calendarDays,
    });
  }

  private cycleCalendarDays(
    currentIndex: number,
    lastIndex: number,
    type: CalendarDayTypes,
    year: number,
    month: number,
  ): CalendarDay[] {
    const array: CalendarDay[] = [];

    for (let index = currentIndex; index <= lastIndex; index++) {
      array.push({
        day: index,
        type: type,
        fullDate: new Date(year, month, index),
      });
    }

    return array;
  }

  private getCalendarPrev(
    year: number,
    month: number,
    firstDayofWeek: number,
  ): CalendarDay[] {
    const previousYear = month === 0 ? year - 1 : year;
    const previousMonth = month === 0 ? 11 : month - 1;

    const previousGetDaysInMonth = this.daysInMonth(
      previousYear,
      previousMonth,
    );

    const startIndexPreviousMonth = previousGetDaysInMonth - firstDayofWeek + 1;

    return this.cycleCalendarDays(
      startIndexPreviousMonth,
      previousGetDaysInMonth,
      'prev',
      previousYear,
      previousMonth,
    );
  }

  private getCalendarNext(
    year: number,
    month: number,
    calendarLength: number,
  ): CalendarDay[] {
    const nextYear = month === 11 ? year + 1 : year;
    const nextMonth = month === 11 ? month + 1 : 0;
    const maxLine = 42 - calendarLength;

    return this.cycleCalendarDays(1, maxLine, 'next', nextYear, nextMonth);
  }

  private daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
}

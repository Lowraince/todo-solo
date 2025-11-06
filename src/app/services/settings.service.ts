import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ThemeApp = 'light' | 'dark';

interface SettingsState {
  theme: ThemeApp;
  timer: {
    timeDuration: string;
    timeRest: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsState = new BehaviorSubject<SettingsState>({
    theme: 'light',
    timer: {
      timeDuration: '2',
      timeRest: '2',
    },
  });

  public settingsState$ = this.settingsState.asObservable();

  public changeTimeDuration(timeDuration: string): void {
    console.log(timeDuration, 'duration');
    const currentState = this.settingsState.value;
    this.settingsState.next({
      ...currentState,
      timer: {
        ...currentState.timer,
        timeDuration,
      },
    });
  }

  public changeTimeRest(timeRest: string): void {
    console.log(timeRest, 'rest duration');
    const currentState = this.settingsState.value;
    this.settingsState.next({
      ...currentState,
      timer: {
        ...currentState.timer,
        timeRest,
      },
    });
  }
}

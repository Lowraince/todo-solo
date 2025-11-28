import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeApp } from '../interfaces/types';

interface SettingsState {
  appThemes: {
    themes: string[];
    activeTheme: ThemeApp;
  };
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
    appThemes: {
      themes: ['light', 'dark', 'auto'],
      activeTheme: 'light',
    },
    timer: {
      timeDuration: '2',
      timeRest: '2',
    },
  });

  public settingsState$ = this.settingsState.asObservable();

  public changeTimeDuration(timeDuration: string): void {
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
    const currentState = this.settingsState.value;
    this.settingsState.next({
      ...currentState,
      timer: {
        ...currentState.timer,
        timeRest,
      },
    });
  }

  public changeTheme(activeTheme: ThemeApp): void {
    const currentState = this.settingsState.value;
    this.settingsState.next({
      ...currentState,
      appThemes: {
        ...currentState.appThemes,
        activeTheme,
      },
    });
  }
}

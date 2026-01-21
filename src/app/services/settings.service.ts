import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppThemesType } from '../interfaces/types';
import { AppThemes } from '../interfaces/enums';

interface SettingsState {
  appThemes: {
    themes: AppThemesType[];
    activeTheme: AppThemesType;
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
      themes: [AppThemes.LIGHT, AppThemes.DARK, AppThemes.AUTO],
      activeTheme: AppThemes.LIGHT,
    },
    timer: {
      timeDuration: '01:00',
      timeRest: '01:00',
    },
  });

  public settingsState$ = this.settingsState.asObservable();

  public changeTimeDuration(timeDuration: string): void {
    const currentState = this.settingsState.value;
    this.settingsState.next({
      ...currentState,
      timer: {
        ...currentState.timer,
        timeDuration: `0${timeDuration}:00`,
      },
    });
  }

  public changeTimeRest(timeRest: string): void {
    const currentState = this.settingsState.value;
    this.settingsState.next({
      ...currentState,
      timer: {
        ...currentState.timer,
        timeRest: `0${timeRest}:00`,
      },
    });
  }

  public changeTheme(activeTheme: AppThemesType): void {
    const currentState = this.settingsState.value;
    const root = document.documentElement;

    if (activeTheme === 'light') {
      delete root.dataset['theme'];
    } else if (activeTheme === 'auto') {
      const hour = new Date().getHours();

      const isNight = hour >= 20 || hour < 6;

      root.dataset['theme'] = isNight ? 'dark' : 'light';
    } else {
      root.dataset['theme'] = 'dark';
    }

    this.settingsState.next({
      ...currentState,
      appThemes: {
        ...currentState.appThemes,
        activeTheme,
      },
    });
  }
}

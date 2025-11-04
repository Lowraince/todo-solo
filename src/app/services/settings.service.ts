import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ThemeApp = 'light' | 'dark';

interface SettingsState {
  theme: ThemeApp;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsState = new BehaviorSubject<SettingsState>({
    theme: 'light',
  });

  public settingsState$ = this.settingsState.asObservable();
}

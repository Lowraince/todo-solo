import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-settings-icon]',
  imports: [],
  templateUrl: './settings.svg',
  styleUrl: './settings-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '20',
    height: '20',
    viewBox: '0 0 20 20',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class SettingsIconComponent {}

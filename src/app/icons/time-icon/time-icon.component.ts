import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-time-icon]',
  imports: [],
  templateUrl: './time.svg',
  styleUrl: './time-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '100%',
    height: '100%',
    viewBox: '0 0 25 25',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class TimeIconComponent {}

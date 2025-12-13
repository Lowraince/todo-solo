import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-peach-icon]',
  imports: [],
  templateUrl: './peach.svg',
  styleUrl: './peach-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '15px',
    height: '15px',
    viewBox: '0 0 15 15',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class PeachIconComponent {}

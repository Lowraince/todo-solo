import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-arrow-icon]',
  imports: [],
  templateUrl: './arrow.svg',
  styleUrl: './arrow-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '15',
    height: '15',
    viewBox: '0 0 11 20',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class ArrowIconComponent {}

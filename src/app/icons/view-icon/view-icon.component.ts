import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-view-icon]',
  imports: [],
  templateUrl: './view.svg',
  styleUrl: './view-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '25',
    height: '25',
    viewBox: '0 0 25 25',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class ViewIconComponent {}

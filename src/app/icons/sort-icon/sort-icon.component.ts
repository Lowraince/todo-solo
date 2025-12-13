import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-sort-icon]',
  imports: [],
  templateUrl: './sort.svg',
  styleUrl: './sort-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '15px',
    height: '15px',
    viewBox: '0 0 15 15',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class SortIconComponent {}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-confirm-icon]',
  imports: [],
  templateUrl: './confirm.svg',
  styleUrl: './confirm-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '40',
    height: '40',
    viewBox: '0 0 80 80',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class ConfirmIconComponent {}

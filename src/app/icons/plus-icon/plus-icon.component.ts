import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-plus-icon]',
  imports: [],
  templateUrl: './plus.svg',
  styleUrl: './plus-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusIconComponent {}

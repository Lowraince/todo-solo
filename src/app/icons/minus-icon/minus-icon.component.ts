import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-minus-icon]',
  imports: [],
  templateUrl: './minus.svg',
  styleUrl: './minus-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinusIconComponent {}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-content-statistic',
  imports: [],
  templateUrl: './main-content-statistic.component.html',
  styleUrl: './main-content-statistic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentStatisticComponent {
  @Input({ required: true }) public description!: string;
  @Input({ required: true }) public value!: string;
  @Input() public minute: boolean = false;
}

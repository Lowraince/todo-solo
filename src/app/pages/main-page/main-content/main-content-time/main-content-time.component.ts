import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-content-time',
  imports: [],
  templateUrl: './main-content-time.component.html',
  styleUrl: './main-content-time.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentTimeComponent {
  @Input({ required: true }) public description!: string;
  @Input({ required: true }) public set time(value: number | null) {
    if (value) {
      this.hours = Math.floor(value / 60);
      this.minutes = value % 60;
    } else {
      this.hours = 0;
      this.minutes = 0;
    }
  }

  public hours = 0;
  public minutes = 0;
}

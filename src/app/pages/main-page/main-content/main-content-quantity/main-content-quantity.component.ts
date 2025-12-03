import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-content-quantity',
  imports: [],
  templateUrl: './main-content-quantity.component.html',
  styleUrl: './main-content-quantity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentQuantityComponent {
  @Input({ required: true }) public description!: string;
  @Input({ required: true }) public quantity!: number | null;
}

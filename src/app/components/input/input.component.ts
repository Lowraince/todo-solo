import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'input[app-input]',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  // @Input({ required: true }) public value: string = '';
}

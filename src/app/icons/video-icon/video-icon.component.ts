import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'svg[app-video-icon]',
  imports: [],
  templateUrl: './video.svg',
  styleUrl: './video-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    width: '21',
    height: '21',
    viewBox: '0 0 21 21',
    xmlns: 'http://www.w3.org/2000/svg',
  },
})
export class VideoIconComponent {}

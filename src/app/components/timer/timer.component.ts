import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-timer',
  imports: [AsyncPipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements AfterViewInit {
  private timerState = inject(TimerService);

  public timeDur$ = this.timerState.timerState$.pipe(
    map((state) => state.timeDuration),
  );

  public timeRest$ = this.timerState.timerState$.pipe(
    map((state) => state.timeRest),
  );

  public canvasHeight$ = this.timerState.timerState$.pipe(
    map((state) => state.canvasHeight),
  );
  public canvasWeigth$ = this.timerState.timerState$.pipe(
    map((state) => state.canvasWidth),
  );

  @ViewChild('timerCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  public ngAfterViewInit(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas 2D context is not supported');
    }

    this.ctx = context;
    this.drawProgressScale();
  }

  private drawProgressScale(): void {
    this.ctx.clearRect(0, 0, 400, 400);

    const gradient = this.ctx.createConicGradient(0, 400, 400);

    gradient.addColorStop(0, 'hsla(0, 100%, 50%, 0.3)');
    gradient.addColorStop(0.25, 'hsla(0, 100%, 50%, 0.6)');
    gradient.addColorStop(0.5, 'hsla(0, 100%, 50%, 0.8)');
    gradient.addColorStop(0.75, 'hsla(0, 100%, 50%, 0.9)');
    gradient.addColorStop(1, 'hsla(0, 100%, 50%, 1)');

    this.ctx.beginPath();
    this.ctx.arc(400, 400, 400 - 14, 0, 0 + 10);

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 20;
    this.ctx.stroke();
  }
}

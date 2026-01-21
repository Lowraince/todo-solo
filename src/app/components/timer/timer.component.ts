import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { combineLatest, map, tap } from 'rxjs';
import { convertTimeToSeconds } from '../../utils/convert-time';
import { SettingsService } from '../../services/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements AfterViewInit, OnInit {
  private timerState = inject(TimerService);
  private settingsState = inject(SettingsService);
  private destroy = inject(DestroyRef);

  private timerFocus$ = this.timerState.timerState$.pipe(
    map((state) => state.focusTime),
  );

  private settingsTimes$ = this.settingsState.settingsState$.pipe(
    map((state) => {
      return {
        timeRest: convertTimeToSeconds(state.timer.timeRest),
        timeDuration: convertTimeToSeconds(state.timer.timeDuration),
      };
    }),
  );

  private totalSeconds: number | null = null;
  private startTime: number | null = null;
  private animationId: number | null = null;
  private expectedRemaining: number | null = this.totalSeconds;
  private remainingSeconds: number | null = this.totalSeconds;

  public timeDuration$ = this.timerState.timerState$.pipe(
    map((state) => state.timeDuration),
  );

  public timeRest$ = this.timerState.timerState$.pipe(
    map((state) => state.timeRest),
  );

  public timeDurationConvert$ = this.timeDuration$.pipe(
    map((time) => convertTimeToSeconds(time)),
  );

  public readonly canvasHeight = 400;
  public readonly canvasWidth = 400;

  @ViewChild('timerCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  public ngOnInit(): void {
    this.initTotalSeconds();
  }

  public ngAfterViewInit(): void {
    this.initCanvas();
  }

  public startHandler(): void {
    this.timerState.startTimer();
    this.startTime = Date.now();
    this.expectedRemaining = this.remainingSeconds;
    this.animationId = requestAnimationFrame(this.animate);
  }

  private initTotalSeconds(): void {
    combineLatest([this.timerFocus$, this.settingsTimes$])
      .pipe(
        takeUntilDestroyed(this.destroy),
        tap(([focus, { timeRest, timeDuration }]) => {
          this.totalSeconds = focus === 'focus' ? timeDuration : timeRest;
        }),
      )
      .subscribe();
  }

  private animate = (): void => {
    if (!this.startTime) return;
    if (!this.expectedRemaining) return;

    const elapsedSeconds = (Date.now() - this.startTime) / 1000;

    this.remainingSeconds = Math.max(
      0,
      this.expectedRemaining - elapsedSeconds,
    );

    this.drawProgressScale();

    if (this.remainingSeconds > 0) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.timerState.stopTimer();
      this.startTime = null;

      // if (this.isFocusTimer()) {
      //   this.switchTimer('rest');

      //   const selectedTodo = this.selectedTodo();

      //   if (selectedTodo) {
      //     this.store.increasePomodoroValueComplete(
      //       selectedTodo.idTodo,
      //       selectedTodo.pomodoroValueComplete + 1,
      //     );

      //     if (
      //       selectedTodo.pomodoroValue <= selectedTodo.pomodoroValueComplete
      //     ) {
      //       this.store.todoChangePomodoroValue(
      //         selectedTodo.idTodo,
      //         selectedTodo.pomodoroValueComplete + 1,
      //       );
      //     }

      //     this.store.increaseTimeSpent(selectedTodo.idTodo);
      //   }
      // } else {
      //   this.switchTimer('focus');
      // }
    }
  };

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas 2D context is not supported');
    }
    console.log('init');
    this.ctx = context;
    this.drawProgressScale();
  }

  private progressDegrees(): number {
    return (
      ((this.totalSeconds! + this.remainingSeconds!) / this.totalSeconds!) * 360
    );
  }

  private localTimer(): string {
    const totalSeconds = this.remainingSeconds;
    const minutes = Math.floor(totalSeconds! / 60);
    const seconds = Math.ceil(totalSeconds! % 60);

    if (seconds === 60) {
      return `${(minutes + 1).toString().padStart(2, '0')}:00`;
    }

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  private drawProgressScale(): void {
    this.clearCanvas();

    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const radius = this.canvasWidth / 2 - 10;

    const progressRadians = (this.progressDegrees() * Math.PI) / 180;
    const startAngle = -Math.PI / 2;

    const gradient = this.ctx.createConicGradient(startAngle, centerX, centerY);

    gradient.addColorStop(0, 'hsla(0, 100%, 50%, 0.3)');
    gradient.addColorStop(0.25, 'hsla(0, 100%, 50%, 0.6)');
    gradient.addColorStop(0.5, 'hsla(0, 100%, 50%, 0.8)');
    gradient.addColorStop(0.75, 'hsla(0, 100%, 50%, 0.9)');
    gradient.addColorStop(1, 'hsla(0, 100%, 50%, 1)');

    this.ctx.beginPath();
    this.ctx.arc(
      centerX,
      centerY,
      radius - 14,
      startAngle,
      startAngle + progressRadians,
    );

    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 20;
    this.ctx.stroke();

    this.drawSecondsBrigs();
    this.drawTimerText();
  }

  private drawTimerText(): void {
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;

    this.ctx.fillStyle = '#000000';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    console.log(this.localTimer());
    this.ctx.fillText(this.localTimer(), centerX, centerY);
  }

  private drawSecondsBrigs(): void {
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const radius = this.canvasWidth / 2 - 10;

    for (let index = 0; index < 60; index++) {
      const angle = (index * 6 - 90) * (Math.PI / 180);
      const isMajor = index % 5 === 0;

      this.ctx.beginPath();
      const startRadius = isMajor ? radius - 15 : radius - 10;
      const endRadius = radius - 5;

      this.ctx.moveTo(
        centerX + startRadius * Math.cos(angle),
        centerY + startRadius * Math.sin(angle),
      );

      this.ctx.lineTo(
        centerX + endRadius * Math.cos(angle),
        centerY + endRadius * Math.sin(angle),
      );

      this.ctx.strokeStyle = isMajor ? '#333' : '#666';
      this.ctx.lineWidth = isMajor ? 3 : 2;
      this.ctx.stroke();
    }
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}

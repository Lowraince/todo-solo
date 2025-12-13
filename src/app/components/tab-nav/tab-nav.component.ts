import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TimeIconComponent } from '../../icons/time-icon/time-icon.component';
import { CalendarMissIconComponent } from '../../icons/calendar-miss-icon/calendar-miss-icon.component';
import { SunsetIconComponent } from '../../icons/sunset-icon/sunset-icon.component';
import { SunIconComponent } from '../../icons/sun-icon/sun-icon.component';
import { CalendarIconComponent } from '../../icons/calendar-icon/calendar-icon.component';
import { GeneralIconComponent } from '../../icons/general-icon/general-icon.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tab-nav',
  imports: [
    TimeIconComponent,
    CalendarMissIconComponent,
    SunsetIconComponent,
    SunIconComponent,
    CalendarIconComponent,
    GeneralIconComponent,
    NgClass,
  ],
  templateUrl: './tab-nav.component.html',
  styleUrl: './tab-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabNavComponent {
  @Input({ required: true }) public text!: string;
  @Input({ required: true }) public activeNav!: string;

  @Output() public changeNav = new EventEmitter<string>();

  public activeClassName(): { 'tab-nav_active': boolean } {
    return { 'tab-nav_active': this.text === this.activeNav };
  }

  public changeActiveNav(item: string): void {
    this.changeNav.emit(item);
  }
}

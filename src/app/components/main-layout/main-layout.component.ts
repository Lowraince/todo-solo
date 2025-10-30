import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainContentComponent } from '../main-content/main-content.component';
import { MainSidebarComponent } from '../main-sidebar/main-sidebar.component';

@Component({
  selector: 'app-main-layout',
  imports: [MainContentComponent, MainSidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}

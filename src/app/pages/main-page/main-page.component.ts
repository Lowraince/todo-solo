import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { HeaderMainComponent } from '../../components/header-main/header-main.component';
import { AuthService } from '../../services/auth.service';
import { MainLayoutComponent } from '../../components/main-layout/main-layout.component';

@Component({
  selector: 'app-main-page',
  imports: [HeaderMainComponent, MainLayoutComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {
  private authService = inject(AuthService);

  public ngOnInit(): void {
    this.authService.initProfile();
  }
}

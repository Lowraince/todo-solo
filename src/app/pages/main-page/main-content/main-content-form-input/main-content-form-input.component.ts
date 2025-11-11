import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PeachIconComponent } from '../../../../icons/peach-icon/peach-icon.component';
import { PlusIconComponent } from '../../../../icons/plus-icon/plus-icon.component';
import { ArrowIconComponent } from '../../../../icons/arrow-icon/arrow-icon.component';
import { NgClass } from '@angular/common';

interface ActiveValues {
  isComplete: boolean;
  arrayIcons: number[];
  lastIndex: number | null;
}

@Component({
  selector: 'app-main-content-form-input',
  imports: [PeachIconComponent, PlusIconComponent, ArrowIconComponent, NgClass],
  templateUrl: './main-content-form-input.component.html',
  styleUrl: './main-content-form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentFormInputComponent {
  public activeValues: ActiveValues = {
    isComplete: false,
    arrayIcons: Array.from({ length: 5 }, () => 0),
    lastIndex: null,
  };

  public onHover(index: number): void {
    if (!this.activeValues.isComplete) {
      this.resetIcons();
      this.activeValues.arrayIcons.fill(1, 0, index + 1);
    }
  }

  public isActiveIcon(item: number): boolean {
    return item === 1;
  }

  public onClick(index: number): void {
    const isSameIcon = this.activeValues.lastIndex === index;

    this.activeValues.arrayIcons.fill(0);

    if (isSameIcon) {
      this.activeValues.lastIndex = null;
      this.activeValues.isComplete = false;
    } else {
      this.activeValues.arrayIcons.fill(1, 0, index + 1);
      this.activeValues.lastIndex = index;
      this.activeValues.isComplete = true;
    }
  }

  public onMouseLeave(): void {
    this.resetIcons();
  }

  private resetIcons(): void {
    if (!this.activeValues.isComplete) {
      this.activeValues.arrayIcons.fill(0);
    }
  }
}

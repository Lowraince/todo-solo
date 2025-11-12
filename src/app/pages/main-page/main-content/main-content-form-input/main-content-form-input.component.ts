import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PeachIconComponent } from '../../../../icons/peach-icon/peach-icon.component';
import { PlusIconComponent } from '../../../../icons/plus-icon/plus-icon.component';
import { ArrowIconComponent } from '../../../../icons/arrow-icon/arrow-icon.component';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDirection,
  ModalIncreaseComponent,
} from '../../../../components/modals/modal-increase/modal-increase.component';
import { ModalsOpenService } from '../../../../services/modals-open.service';
import { map } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { emptyValidator } from '../../../../utils/validators/validator-empty';

interface ActiveValues {
  isComplete: boolean;
  arrayIcons: number[];
  lastIndex: number | null;
}

@Component({
  selector: 'app-main-content-form-input',
  imports: [
    PeachIconComponent,
    PlusIconComponent,
    ArrowIconComponent,
    NgClass,
    ModalIncreaseComponent,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './main-content-form-input.component.html',
  styleUrl: './main-content-form-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentFormInputComponent {
  private openModalState = inject(ModalsOpenService);

  public addTodoForm = new FormGroup({
    text: new FormControl('', [Validators.required, emptyValidator]),
    values: new FormControl(0, { nonNullable: true }),
  });

  public modalIncrease = this.openModalState.modalsState$.pipe(
    map((state) => state.increaseModal),
  );

  public activeValues: ActiveValues = {
    isComplete: false,
    arrayIcons: Array.from({ length: 5 }, () => 0),
    lastIndex: null,
  };

  public addTodo(): void {
    const form = this.addTodoForm;

    if (form.invalid) return;

    console.log(form.value);
  }

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
    const formValues = this.addTodoForm.controls.values;
    const isSameIcon = this.activeValues.lastIndex === index;

    this.activeValues.arrayIcons.fill(0);

    if (isSameIcon) {
      this.activeValues.lastIndex = null;
      this.activeValues.isComplete = false;
      formValues.setValue(0);
    } else {
      this.activeValues.arrayIcons.fill(1, 0, index + 1);
      this.activeValues.lastIndex = index;
      this.activeValues.isComplete = true;
      formValues.setValue(index + 1);
    }
  }

  public onValueChange(direction: ChangeDirection): void {
    const formValues = this.addTodoForm.controls.values;

    if (!formValues) return;

    if (formValues.value < 6 || formValues.value > 0) {
      this.activeValues.lastIndex = formValues.value;
    }

    if (direction === 'plus') {
      if (formValues.value === 1000) return;

      formValues.setValue(formValues.value + 1);
      this.activeValues.arrayIcons.fill(1, 0, formValues.value);
      this.activeValues.isComplete = true;
    } else {
      if (formValues.value === 0) {
        this.activeValues = {
          ...this.activeValues,
          isComplete: false,
          lastIndex: null,
        };
        return;
      }
      this.activeValues.isComplete = true;
      this.activeValues.arrayIcons.fill(0);
      this.activeValues.arrayIcons.fill(1, 0, formValues.value - 1);

      formValues.setValue(formValues.value - 1);
    }
  }

  public onInputValueChange(input: number): void {
    if (input === 0) {
      this.activeValues = {
        ...this.activeValues,
        isComplete: false,
        lastIndex: null,
      };

      return;
    }

    if (input < 6 || input > 0) {
      this.activeValues = {
        ...this.activeValues,
        isComplete: true,
        lastIndex: input - 1,
      };
      this.activeValues.arrayIcons.fill(0);
      this.activeValues.arrayIcons.fill(1, 0, input);
    }
  }

  public onMouseLeave(): void {
    this.resetIcons();
  }

  public openIncreaseModal(): void {
    this.openModalState.openModal('increaseModal');
  }

  private resetIcons(): void {
    if (!this.activeValues.isComplete) {
      this.activeValues.arrayIcons.fill(0);
    }
  }
}

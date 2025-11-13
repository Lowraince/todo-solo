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

  public modalIncrease = this.openModalState.modalsState$.pipe(
    map((state) => state.increaseModal),
  );

  public activeValues: ActiveValues = {
    isComplete: false,
    arrayIcons: Array.from({ length: 5 }, () => 0),
    lastIndex: null,
  };

  public addTodoForm = new FormGroup({
    text: new FormControl('', [Validators.required, emptyValidator]),
    values: new FormControl(0, { nonNullable: true }),
  });

  public addTodo(): void {
    const form = this.addTodoForm;

    if (form.invalid) return;

    console.log(form.value);
  }

  public onClick(index: number): void {
    const formValues = this.addTodoForm.controls.values;

    const indexPlusOne = index + 1;

    if (this.isSameIcon(indexPlusOne)) {
      this.clearValues(formValues);
    } else {
      this.setValues(formValues, indexPlusOne);
    }
  }

  private clearValues(formValues: FormControl<number>): void {
    this.activeValues.arrayIcons.fill(0);

    this.activeValues = {
      ...this.activeValues,
      isComplete: false,
      lastIndex: null,
    };

    formValues.setValue(0);
  }

  private setValues(formValues: FormControl<number>, index: number): void {
    this.activeValues.arrayIcons.fill(0);

    this.activeValues = {
      ...this.activeValues,
      isComplete: true,
      lastIndex: index,
    };

    this.activeValues.arrayIcons.fill(1, 0, index);
    formValues.setValue(index);
  }

  public onValueChangeDirection(direction: ChangeDirection): void {
    const formValues = this.addTodoForm.controls.values;

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

  public onHoverValues(index: number): void {
    if (!this.activeValues.isComplete) {
      this.resetIcons();
      this.activeValues.arrayIcons.fill(1, 0, index + 1);
    }
  }

  public onMouseLeave(): void {
    this.resetIcons();
  }

  public isActiveIcon(item: number): boolean {
    return item === 1;
  }

  public openIncreaseModal(): void {
    this.openModalState.openModal('increaseModal');
  }

  private resetIcons(): void {
    if (!this.activeValues.isComplete) {
      this.activeValues.arrayIcons.fill(0);
    }
  }

  private isSameIcon(index: number): boolean {
    return this.activeValues.lastIndex === index;
  }
}

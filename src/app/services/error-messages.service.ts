import { Injectable } from '@angular/core';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ErrorMessagesService {
  private capitalize = new CapitalizePipe();

  public getErrorMessages(
    control: AbstractControl,
    inputName: string,
  ): string[] {
    const messages: string[] = [];

    this.addCommonValidationMessages(messages, control, inputName);
    this.addCustomValidationMessages(messages, control, inputName);
    this.addPasswordValidationMessages(messages, control, inputName);

    return messages;
  }

  private addCommonValidationMessages(
    messages: string[],
    control: AbstractControl,
    inputName: string,
  ): void {
    if (control.hasError('required')) {
      messages.push(`${this.capitalize.transform(inputName)} is required.`);
    }

    if (control.hasError('maxlength')) {
      messages.push(
        `${this.capitalize.transform(inputName)} must be at most ${control.getError('maxlength')?.requiredLength} characters.`,
      );
    }

    if (control.hasError('minlength')) {
      messages.push(
        `${this.capitalize.transform(inputName)} must be at least ${control.getError('minlength')?.requiredLength} characters.`,
      );
    }
  }

  private addCustomValidationMessages(
    messages: string[],
    control: AbstractControl,
    inputName: string,
  ): void {
    if (control.hasError('multipleWords')) {
      messages.push(`A ${inputName} cannot contain two or more words.`);
    }

    if (control.hasError('hasDigit')) {
      messages.push(`The ${inputName} must not contain numbers.`);
    }

    if (control.hasError('noSpaces')) {
      messages.push(`No spaces allowed`);
    }
  }

  private addPasswordValidationMessages(
    messages: string[],
    control: AbstractControl,
    inputName: string,
  ): void {
    if (control.hasError('nicknameTaken')) {
      messages.push(
        `${this.capitalize.transform(inputName)} is already exists`,
      );
    }

    if (control.hasError('isStrong')) {
      messages.push(
        `${this.capitalize.transform(inputName)} must contain digits, uppercase, lowercase & symbols`,
      );
    }

    if (control.hasError('passwordMismatch')) {
      messages.push(`Passwords do not match`);
    }
  }
}

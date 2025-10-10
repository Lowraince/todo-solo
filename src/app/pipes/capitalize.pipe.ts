import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  public transform(value: string): string {
    return value.slice(0, 1).toUpperCase() + value.slice(1);
  }
}

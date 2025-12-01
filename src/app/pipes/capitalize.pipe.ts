import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  public transform(value: string | null): string {
    if (!value) return '';
    return value[0].toUpperCase() + value.slice(1);
  }
}

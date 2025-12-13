import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceModalDescription',
})
export class SliceModalDescriptionPipe implements PipeTransform {
  public transform(value: string | null): string {
    if (!value) return '';
    return value.length > 10 ? `${value.slice(0, 10)}...` : value;
  }
}

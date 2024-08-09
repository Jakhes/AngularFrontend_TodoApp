import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true,
  // by defining it as impure, lets it detect changes to the todo List
  // or else new elements would not be pulled through the pipe
  // impure pipes can affect performance
  pure: false,
})
export class SortPipe implements PipeTransform {
  transform(items: any[], field: string, ascending: boolean = true): any[] {
    if (!items || !field) return items;
    return items.sort((a, b) => {
      if (a[field] < b[field]) return ascending ? -1 : 1;
      if (a[field] > b[field]) return ascending ? 1 : -1;
      return 0;
    });
  }
}

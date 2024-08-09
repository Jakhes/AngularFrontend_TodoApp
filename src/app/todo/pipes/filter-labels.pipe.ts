import { Pipe, PipeTransform } from '@angular/core';

import { Label, Todo } from '../models/todo';

@Pipe({
  name: 'filterLabels',
  standalone: true,
  // by defining it as impure, lets it detect changes to the todo List
  // or else new elements would not be pulled through the pipe
  // impure pipes can affect performance
  pure: false,
})
export class FilterLabelsPipe implements PipeTransform {
  transform(todos: Todo[], label: Label | null): Todo[] {
    if (!todos) {
      return [];
    }
    if (label === null) {
      return todos;
    }

    return todos.filter((x) => x.labels.some((y) => y.id == label.id));
  }
}

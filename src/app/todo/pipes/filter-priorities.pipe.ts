import { Pipe, PipeTransform } from '@angular/core';
import { Priority, Todo } from '../models/todo';

@Pipe({
  name: 'filterPriorities',
  standalone: true,
  // by defining it as impure, lets it detect changes to the todo List
  // or else new elements would not be pulled through the pipe
  // impure pipes can affect performance
  pure: false,
})
export class FilterPrioritiesPipe implements PipeTransform {
  transform(todos: Todo[], priority: Priority | null): Todo[] {
    if (!todos) {
      return [];
    }
    if (priority === null) {
      return todos;
    }

    return todos.filter((x) => x.priority == priority);
  }
}

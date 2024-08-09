import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../models/todo';

@Pipe({
  name: 'filterCompleted',
  standalone: true,
  // by defining it as impure, lets it detect changes to the todo List
  // or else new elements would not be pulled through the pipe
  // impure pipes can affect performance
  pure: false,
})
export class FilterCompletedPipe implements PipeTransform {
  transform(todos: Todo[], filterCompleted: Boolean): Todo[] {
    if (!todos) {
      return [];
    }
    if (!filterCompleted) {
      return todos;
    }

    return todos.filter((x) => x.done == false);
  }
}

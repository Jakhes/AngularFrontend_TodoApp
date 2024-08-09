import { Pipe, PipeTransform } from '@angular/core';
import { Todo } from '../todo';

@Pipe({
  name: 'filterUser',
  standalone: true,
  // by defining it as impure, lets it detect changes to the todo List
  // or else new elements would not be pulled through the pipe
  // impure pipes can affect performance
  pure: false,
})
export class FilterUserPipe implements PipeTransform {
  transform(todos: Todo[], userId: number): Todo[] {
    if (!todos) {
      return [];
    }
    if (userId == -1) {
      return todos;
    }

    return todos.filter((x) => x.assigned_user?.id == userId);
  }
}

import { Component, inject, model, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Label, Priority, Todo, User } from '../../models/todo';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

// Angular Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { LabelService } from '../../services/label.service';
import { UserService } from '../../services/user.service';

import { SortPipe } from '../../pipes/sort.pipe';
import { FilterCompletedPipe } from '../../pipes/filter-completed.pipe';
import { FilterLabelsPipe } from '../../pipes/filter-labels.pipe';
import { FilterPrioritiesPipe } from '../../pipes/filter-priorities.pipe';
import { FilterUserPipe } from '../../pipes/filter-user.pipe';
import { TodoViewDialog } from '../todoViewDialog/TodoViewDialog';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatCheckboxModule,
    MatGridListModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    TranslateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSelectModule,
    SortPipe,
    FilterCompletedPipe,
    FilterLabelsPipe,
    FilterPrioritiesPipe,
    FilterUserPipe,
  ],

  providers: [DatePipe],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  // variables
  readonly priorityTypes = Object.values(Priority);

  public todos: Todo[] = [];
  public labels: Label[] = [];
  public users: User[] = [];
  inputTodo: String = '';

  public sortByField: string = 'name';
  public ascending = model(true);
  public filterPriority: Priority | null = null;
  public filterUserId: number = -1;
  public filterLabels: Label | null = null;

  public filterCompleted: boolean = false;

  readonly dialog = inject(MatDialog);

  readonly checked_slider = model(false);

  readonly year = new Date().getFullYear();

  // Inject Todoservice
  constructor(
    private todoService: TodoService,
    private labelService: LabelService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getTodos();
    this.getLabels();
    this.getUsers();
    this.toggleFilterCompletedTasks();
    this.year;
  }

  public setPriorityFilter(priority: Priority) {
    this.filterPriority = priority;
  }

  public setUserFilter(user: number) {
    this.filterUserId = user;
  }

  public setLabelsFilter(label: Label) {
    this.filterLabels = label;
  }

  public toggleFilterCompletedTasks() {
    this.filterCompleted = this.checked_slider();
  }

  public clearAllFilters() {
    this.sortByField = 'name';
    this.ascending.set(true);
    this.filterPriority = null;
    this.filterUserId = -1;
    this.filterLabels = null;
    this.filterCompleted = false;
  }

  // Function to update Todo if the done Checkbox is clicked
  toggleIfTaskDone(id: number, event: MouseEvent) {
    this.todos.map((v) => {
      if (v.id == id) {
        v.done = !v.done;
        this.todoService.updateTodo(v).subscribe({
          error: (e) => alert(e),
        });
      }
    });
    event.stopPropagation();
  }

  //#region "Todo Functions"

  public getTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (v) => (this.todos = v),
      error: (e) => alert(e),
    });
  }

  public addTodo(todo: Todo) {
    this.todoService.addTodo(todo).subscribe({
      next: (value: Todo) => this.todos.push(value),
      error: (e) => alert(e),
    });
    this.inputTodo = '';
  }

  deleteTodo(id: number, event: MouseEvent) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => (this.todos = this.todos.filter((x) => x.id !== id)),
      error: (e) => alert(e),
    });

    event.stopPropagation();
  }

  //#endregion Todo Functions"

  //#region "Label Functions"

  public getLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (v: Label[]) => (this.labels = v),
      error: (e) => alert(e),
    });
  }

  //#endregion Label Functions"

  //#region "User Functions"

  public getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (v: User[]) => (this.users = v),
      error: (e) => alert(e),
    });
  }

  //#endregion User Functions"

  openNewTodoView(): void {
    const dialogRef = this.dialog.open(TodoViewDialog, {
      data: {
        id: -1,
        name: '',
        done: false,
        creation_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        due_date: '',
        priority: Priority.Priority4,
        labels: [],
        assigned_user: null,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.addTodo(result);
      }
    });
  }

  openSelectedTodoView(todo_index: number): void {
    const dialogRef = this.dialog.open(TodoViewDialog, {
      data: this.todos[todo_index],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.todoService.updateTodo(result).subscribe({
          next: (v) => (this.todos[todo_index] = v),
          error: (e) => alert(e),
        });
      }
    });
  }
}

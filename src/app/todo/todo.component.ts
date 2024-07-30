import { Component, inject, model, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Priority, Todo } from './todo';
import { TodoService } from './todo.service';
import { FormControl, FormsModule } from '@angular/forms';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';

@Component({
  selector: 'app-todo',
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
  ],
  providers: [DatePipe],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  // variables
  public todos: Todo[] = [];
  inputTodo: String = '';
  filterConfig: String = '';

  readonly name = model('');
  readonly dialog = inject(MatDialog);

  // Inject Todoservice
  constructor(private todoService: TodoService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getTodos();
  }

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

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => (this.todos = this.todos.filter((x) => x.id !== id)),
      error: (e) => alert(e),
    });
  }

  // Filter Functions
  filterForActive() {
    this.filterConfig = 'only-notdone';
  }

  filterForCompleted() {
    this.filterConfig = 'only-done';
  }

  filterForAll() {
    this.filterConfig = '';
  }

  // Function to update Todo if the done Checkbox is clicked
  toggleIfTaskDone(id: number) {
    this.todos.map((v) => {
      if (v.id == id) {
        v.done = !v.done;
        this.todoService.updateTodo(v).subscribe({
          error: (e) => alert(e),
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TodoViewDialog, {
      data: {
        id: -1,
        name: this.inputTodo,
        done: false,
        creation_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        due_date: '',
        priority: Priority.Priority4,
        labels: [],
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

@Component({
  selector: 'todo-view-dialog',
  templateUrl: 'todo-view.component.html',
  standalone: true,
  imports: [
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class TodoViewDialog {
  readonly priorityTypes = Object.values(Priority);

  readonly dialogRef = inject(MatDialogRef<TodoViewDialog>);
  readonly data = inject<Todo>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);
  readonly due_date = new FormControl(
    this.data.due_date ? new Date(this.data.due_date.toString()) : null
  );
  readonly priority = model(this.data.priority);
  readonly labels = model(this.data.labels);

  readonly isNewTask: boolean = this.data.id == -1;

  constructor(private datePipe: DatePipe) {}

  onClickToday() {
    this.due_date.setValue(new Date());
  }
  onClickTomorrow() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.due_date.setValue(date);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddTaskClick() {
    this.dialogRef.close({
      id: this.data.id,
      name: this.name(),
      done: this.data.done,
      creation_date: this.data.creation_date,
      due_date: this.due_date
        ? this.datePipe.transform(this.due_date.value, 'yyyy-MM-dd')
        : '',
      priority: this.priority(),
      labels: this.labels(),
    });
  }
}

import { Component, inject, model, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Label, Priority, Todo, User } from './todo';
import { TodoService } from './todo.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { LabelService } from './label.service';
import { UserService } from './user.service';

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
  public labels: Label[] = [];
  public users: User[] = [];
  inputTodo: String = '';
  filterConfig: String = '';

  readonly name = model('');
  readonly dialog = inject(MatDialog);

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

  deleteTodo(id: number, event: MouseEvent) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => (this.todos = this.todos.filter((x) => x.id !== id)),
      error: (e) => alert(e),
    });

    event.stopPropagation();
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

  //#region "Label Functions"

  public getLabels(): void {
    this.labelService.getLabels().subscribe({
      next: (v: Label[]) => (this.labels = v),
      error: (e) => alert(e),
    });
  }

  public addLabel(label: Label) {
    this.labelService.addLabel(label).subscribe({
      next: (value: Label) => this.labels.push(value),
      error: (e) => alert(e),
    });
  }

  deleteLabel(id: number) {
    this.labelService.deleteLabel(id).subscribe({
      next: () => (this.labels = this.labels.filter((x) => x.id !== id)),
      error: (e) => alert(e),
    });
  }

  //#endregion Label Functions"

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
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
})
export class TodoViewDialog implements OnInit {
  readonly priorityTypes = Object.values(Priority);

  readonly dialogRef = inject(MatDialogRef<TodoViewDialog>);
  readonly data = inject<Todo>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);
  readonly due_date = new FormControl(
    this.data.due_date ? new Date(this.data.due_date.toString()) : null
  );
  readonly priority = model(this.data.priority);
  labels = new FormControl(this.data.labels);
  labelList: Label[] = this.data.labels;
  readonly assigned_User = model(this.data.assigned_user);
  userList: User[] = [];

  readonly isNewTask: boolean = this.data.id == -1;

  constructor(
    private datePipe: DatePipe,
    private labelService: LabelService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.setUpLabels();
    this.setUpUsers();
  }

  setUpLabels() {
    this.labelService.getLabels().subscribe({
      next: (v) => (
        // gets all the labels and saves them in the labelsList
        (this.labelList = v),
        // for some reason does it not recognise that the elements from labels and labelsList
        // are the same Labels so i have to get their intersection and set it as the value
        // for labels
        this.labels.setValue(
          this.labelList.filter((x) =>
            this.data.labels.some((y) => x.id === y.id)
          )
        )
      ),
      error: (e) => alert(e),
    });
  }

  setUpUsers() {
    this.userService.getUsers().subscribe({
      next: (v) => (
        // gets all the users and saves them in the usersList
        (this.userList = v),
        this.assigned_User.set(
          this.userList.find((x) => x.id === this.assigned_User()?.id) ||
            this.assigned_User()
        )
      ),
      // for some reason does it not recognise that the elements from users and usersList
      // are the same Users so i have to get their intersection and set it as the value
      // for users

      error: (e) => alert(e),
    });
  }

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
    this.labelList;
    this.labels;
    this.dialogRef.close({
      id: this.data.id,
      name: this.name(),
      done: this.data.done,
      creation_date: this.data.creation_date,
      due_date: this.due_date
        ? this.datePipe.transform(this.due_date.value, 'yyyy-MM-dd')
        : '',
      priority: this.priority(),
      labels: this.labels.value,
      assigned_user: this.assigned_User(),
    });
  }
}

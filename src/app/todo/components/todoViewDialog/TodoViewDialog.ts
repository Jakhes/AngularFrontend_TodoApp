import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Priority, Todo, Label, User } from '../../models/todo';
import { LabelService } from '../../services/label.service';
import { UserService } from '../../services/user.service';

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
    if (this.name().length <= 0) {
      return;
    }
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

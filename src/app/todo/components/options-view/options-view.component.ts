import { Component, inject, OnInit } from '@angular/core';
import { Label, User } from '../../models/todo';
import { LabelService } from '../../services/label.service';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { LabelDialog } from './label-dialog/label-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDialog } from './user-dialog/user-dialog.component';

@Component({
  selector: 'todo-options-view',
  standalone: true,
  imports: [
    MatDivider,
    MatExpansionModule,
    MatListModule,
    MatIcon,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './options-view.component.html',
  styleUrl: './options-view.component.scss',
})
export class OptionsViewComponent implements OnInit {
  public labels: Label[] = [];
  public users: User[] = [];

  readonly dialog = inject(MatDialog);

  constructor(
    private labelService: LabelService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getLabels();
    this.getUsers();
  }

  public getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (v: User[]) => (this.users = v),
      error: (e) => alert(e),
    });
  }

  public addUser(user: User) {
    this.userService.addUser(user).subscribe({
      next: (value: User) => this.users.push(value),
      error: (e) => alert(e),
    });
  }

  public deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => (this.users = this.users.filter((x) => x.id !== id)),
      error: (e) => alert(e),
    });
  }

  openNewUserDialog(): void {
    const dialogRef = this.dialog.open(UserDialog, {
      data: {
        id: -1,
        name: '',
        password: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.addUser(result);
      }
    });
  }

  openSelectedUserDialog(user: User, user_Index: number): void {
    const dialogRef = this.dialog.open(UserDialog, {
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.userService.updateUser(result).subscribe({
          next: (v) => (this.users[user_Index] = v),
          error: (e) => alert(e),
        });
      }
    });
  }

  //
  // Label Functions
  //
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

  public deleteLabel(id: number) {
    this.labelService.deleteLabel(id).subscribe({
      next: () => (this.labels = this.labels.filter((x) => x.id !== id)),
      error: (e) => alert(e),
    });
  }
  openNewLabelDialog(): void {
    const dialogRef = this.dialog.open(LabelDialog, {
      data: {
        id: -1,
        name: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.addLabel(result);
      }
    });
  }

  openSelectedLabelDialog(label: Label, label_Index: number): void {
    const dialogRef = this.dialog.open(LabelDialog, {
      data: label,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.labelService.updateLabel(result).subscribe({
          next: (v) => (this.labels[label_Index] = v),
          error: (e) => alert(e),
        });
      }
    });
  }
}

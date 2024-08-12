import { Component, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

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
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../models/todo';
@Component({
  selector: 'user-dialog',
  templateUrl: 'user-dialog.component.html',
  styleUrl: 'user-dialog.component.scss',
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
    MatIconModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class UserDialog {
  readonly dialogRef = inject(MatDialogRef<UserDialog>);
  readonly data = inject<User>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);

  readonly isNewUser: boolean = this.data.id == -1;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddUserClick() {
    if (this.name().length <= 0) {
      return;
    }
    this.dialogRef.close({
      id: this.data.id,
      name: this.name(),
      password: this.data.password,
    });
  }
}

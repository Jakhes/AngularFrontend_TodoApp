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
import { Label } from '../../../models/todo';
@Component({
  selector: 'label-dialog',
  styleUrl: 'label-dialog.component.scss',
  templateUrl: 'label-dialog.component.html',
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
export class LabelDialog {
  readonly dialogRef = inject(MatDialogRef<LabelDialog>);
  readonly data = inject<Label>(MAT_DIALOG_DATA);
  readonly name = model(this.data.name);

  readonly isNewLabel: boolean = this.data.id == -1;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddLabelClick() {
    this.dialogRef.close({
      id: this.data.id,
      name: this.name(),
    });
  }
}

import { Component } from '@angular/core';

// angular Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

// components imports
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { LabelsViewComponent } from './components/labels-view/labels-view.component';

import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    TranslateModule,
    TodoListComponent,
    UserViewComponent,
    LabelsViewComponent,
  ],

  providers: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public see_TodoList: boolean = true;
  public see_UserView: boolean = false;
  public see_LabelView: boolean = false;

  public activate_TodoList() {
    this.see_TodoList = true;
    this.see_UserView = false;
    this.see_LabelView = false;
  }
  public activate_UserView() {
    this.see_TodoList = false;
    this.see_UserView = true;
    this.see_LabelView = false;
  }
  public activate_LabelView() {
    this.see_TodoList = false;
    this.see_UserView = false;
    this.see_LabelView = true;
  }
}

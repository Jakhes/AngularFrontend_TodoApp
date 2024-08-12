import { Component } from '@angular/core';

// angular Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

// components imports
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { OptionsViewComponent } from './components/options-view/options-view.component';

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
    OptionsViewComponent,
  ],

  providers: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  public see_TodoList: boolean = true;
  public see_OptionsView: boolean = false;

  public activate_TodoList() {
    this.see_TodoList = true;
    this.see_OptionsView = false;
  }
  public activate_OptionsView() {
    this.see_TodoList = false;
    this.see_OptionsView = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    MatButtonToggleModule,
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  // variables
  public todos: Todo[] = [];
  inputTodo: String = '';
  filterConfig: String = '';

  // Inject Todoservice
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  public getTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (v) => (this.todos = v),
      error: (e) => alert(e),
    });
  }

  public addTodo() {
    this.todoService
      .addTodo({ id: -1, name: this.inputTodo, done: false })
      .subscribe({
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
}

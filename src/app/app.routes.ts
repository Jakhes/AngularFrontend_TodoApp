import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { ThreeComponent } from './three/three.component';

export const routes: Routes = [
  { path: 'todo', component: TodoComponent },
  { path: 'three-js', component: ThreeComponent },
  // redirect the base url to the /todo route
  { path: '', redirectTo: '/todo', pathMatch: 'full' },
  //{ path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
];

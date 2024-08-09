export interface Todo {
  id: number;
  name: String;
  creation_date: String | null;
  due_date: String | null;
  priority: Priority;
  labels: Array<Label>;
  assigned_user: User;
  done: boolean;
}

export interface User {
  id: number;
  name: String;
  password: String;
}

export interface Label {
  id: number;
  name: String;
}

export enum Priority {
  Priority1 = 'P1',
  Priority2 = 'P2',
  Priority3 = 'P3',
  Priority4 = 'P4',
}

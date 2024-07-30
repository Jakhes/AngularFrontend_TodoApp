export interface Todo {
  id: number;
  name: String;
  creation_date: String | null;
  due_date: String | null;
  priority: Priority;
  labels: Array<String>;
  done: boolean;
}

export interface User {}

export enum Priority {
  Priority1 = 'P1',
  Priority2 = 'P2',
  Priority3 = 'P3',
  Priority4 = 'P4',
}

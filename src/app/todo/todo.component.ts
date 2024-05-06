import { Component, OnInit } from '@angular/core';
import { DatePipe } from "@angular/common";

import { AngularFirestore } from '@angular/fire/compat/firestore';


export interface Todo {
  title: string,
  description: string,
  dueDate: Date,
  attachment: string
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todo: Todo = {
    title: '',
    description: '',
    dueDate: new Date(),
    attachment: ''
  };
  todoList: Todo[] = [];
  todoListTmp: Todo[] = [];
  searchText: string = '';
  selectedTodo!: Todo;
  isUpdate: boolean = false;
  todayDate: any;
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    
    this.getTodo();
    const datePipe = new DatePipe('en-Us');
    this.todayDate = datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.getTodoList().subscribe((data: any) => {
      console.log('data', data);
    })
  }

  addTodo() {
    let todo: any = localStorage.getItem('todo');
    if (todo) {
      todo = JSON.parse(todo);
      todo.push(this.todo);
      localStorage.setItem('todo', JSON.stringify(todo))
    } else {
      localStorage.setItem('todo', JSON.stringify([ this.todo ]))
    }

    this.getTodo()
    this.resetForm();
  }

  getTodo() {
    let todos = localStorage.getItem('todo');
    if (todos) {
      this.todoList = JSON.parse(todos);
      this.todoListTmp = JSON.parse(todos);
    }
  }

  updateTodo(todo: Todo) {
    // todo.isUpdate = true;
    this.todo = todo;
    this.isUpdate = true;
  }

  saveTodo() {
    this.isUpdate = false;
    this.resetForm();
    this.setLocalStorage(this.todoList);
  }

  deleteTodo(index: number) {
    this.todoList.splice(index, 1);
    this.setLocalStorage(this.todoList);
  }

  setLocalStorage(todoList: Todo[]) {
    localStorage.setItem('todo', JSON.stringify(todoList))
  }

  search() {
    this.todoList = this.todoListTmp;
    if (this.searchText.length > 0) {
      let todoList = this.todoList.filter((todo: Todo) => todo.title.toLowerCase().includes(this.searchText) || todo.description.toLowerCase().includes(this.searchText) )
      this.todoList = todoList;
    } else {
      this.todoList = this.todoListTmp;
    }
  }

  readURL(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.todo.attachment = event.target.files[0].name;
    }
  }

  resetForm() {
    this.todo = {
      title: '',
      description: '',
      dueDate: new Date(),
      attachment: ''
    };
  }

  getTodoList() {
    return this.db.collection('todo').snapshotChanges();
  }
}

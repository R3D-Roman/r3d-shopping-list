import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ErrorHendlerService } from "../classes/error-hendler.service";
import { Observable } from "rxjs";
import { Todo, DeleteMessage } from "../interfaces";
import { delay, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  constructor(
    private http: HttpClient,
    private errorHendlerService: ErrorHendlerService
  ) {}

  getAllTodos(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>("/api/todo")
      .pipe(delay(2000), catchError(this.errorHendlerService.handleError));
  }

  getAllCompletedTodos(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>("/api/todo/completed")
      .pipe(delay(2000), catchError(this.errorHendlerService.handleError));
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http
      .post<Todo>("/api/todo", todo)
      .pipe(catchError(this.errorHendlerService.handleError));
  }

  getByIdTodo(id: string): Observable<Todo> {
    return this.http
      .get<Todo>(`/api/todo/${id}`)
      .pipe(delay(1500), catchError(this.errorHendlerService.handleError));
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.http
      .patch<Todo>(`/api/todo/${id}`, todo)
      .pipe(catchError(this.errorHendlerService.handleError));
  }

  deleteTodo(id): Observable<DeleteMessage> {
    return this.http
      .delete<DeleteMessage>(`/api/todo/${id}`)
      .pipe(catchError(this.errorHendlerService.handleError));
  }
}

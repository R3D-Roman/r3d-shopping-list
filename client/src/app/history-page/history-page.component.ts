import { Component, OnInit, OnDestroy } from "@angular/core";
import { TodoService } from "../shared/services/todo.service";
import { Todo } from "../shared/interfaces";
import { Subscription } from "rxjs";
import { MaterialService } from "../shared/classes/material.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { HistoryPositionsModalComponent } from "./history-positions-modal/history-positions-modal.component";

@Component({
  selector: "app-history-page",
  templateUrl: "./history-page.component.html",
  styleUrls: ["./history-page.component.scss"],
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  p: number = 1;
  getAllCompletedTodoSub: Subscription;
  loader: boolean = false;
  isValid: boolean = true;
  disableFilter: boolean = true;
  minDate: Date;
  maxDate: Date;
  start: Date;
  end: Date;
  filterTodo: Todo[] = [];
  calendarFilterStart = null;
  calendarFilterEnd = null;

  constructor(
    private todoservice: TodoService,
    private materialService: MaterialService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllCompletedTodoSub = this.todoservice
      .getAllCompletedTodos()
      .subscribe(
        (data) => {
          if (data.length != 0) {
            this.todos = data;
            this.minDate = data[0].date;
            this.maxDate = data[data.length - 1].date;
            this.todos.sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            this.filterTodo = this.todos;
            this.disableFilter = false;
          }
          this.loader = true;
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
        }
      );
    this.validate();
  }

  ngOnDestroy() {
    if (this.getAllCompletedTodoSub) {
      this.getAllCompletedTodoSub.unsubscribe();
    }
  }

  inputEventStart(event) {
    if (event.value == null) {
      this.isValid = false;
      this.validate();
    }
    this.start = event.value;
    this.calendarFilterStart = event.value;
    this.validate();
  }

  inputEventEnd(event) {
    if (event.value == null) {
      this.isValid = false;
      this.validate();
    }
    this.end = event.value;
    this.calendarFilterEnd = event.value;
    this.validate();
  }

  validate() {
    if (!this.start || !this.end) {
      this.isValid = false;
      return;
    }
    return (this.isValid = this.start < this.end);
  }

  filter() {
    this.filterTodo = this.todos.filter((todo) => {
      const date = new Date(todo.date);
      return (
        (date > this.start && date < this.end) ||
        date.toString().slice(0, 15) === this.end.toString().slice(0, 15)
      );
    });
  }

  clear() {
    this.calendarFilterStart = null;
    this.calendarFilterEnd = null;
    this.start = null;
    this.end = null;
    this.isValid = true;
    this.filterTodo = this.todos;
  }

  openDialog(id: string, total: number, currency: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = "300px";
    dialogConfig.data = {
      id: id,
      total: total,
      currency: currency,
    };
    const dialogRef = this.dialog.open(
      HistoryPositionsModalComponent,
      dialogConfig
    );
  }
}

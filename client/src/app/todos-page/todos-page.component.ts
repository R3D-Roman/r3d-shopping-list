import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription, Subject } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MaterialService } from "../shared/classes/material.service";
import { TodoService } from "../shared/services/todo.service";
import { Todo } from "../shared/interfaces";
import { CreateTodoModalComponent } from "../shared/components/create-todo-modal/create-todo-modal.component";
import { deleteListsAnimation } from "../shared/animation/app.animation";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-todos-page",
  templateUrl: "./todos-page.component.html",
  styleUrls: ["./todos-page.component.scss"],
  animations: [deleteListsAnimation],
})
export class TodosPageComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  todosEmpty: boolean = false;
  checked: boolean = false;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private todoService: TodoService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.todoService
      .getAllTodos()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          if (data) {
            this.todos = data;
            this.todos = this.todos.map((res) => {
              return {
                ...res,
                state: "start",
              };
            });
            // console.log(this.todos);
            this.todos.reverse();
            // console.log(this.todos);
            this.todosEmpty = true;
          }
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
        }
      );

    this.route.queryParams.subscribe((params: Params) => {
      if (params["logedIn"]) {
        this.materialService.snackBar(
          "You successively loged in.",
          "close",
          "done"
        );
      }
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = "300px";
    this.dialog.open(CreateTodoModalComponent, dialogConfig);
  }

  identify(index, item) {
    // console.log(item);
    return item.name || item.completed;
  }

  deleteTodo(id, name) {
    event.stopPropagation();
    const decision = confirm(`You shure wat to delete the category ${name}?`);
    if (decision) {
      // delete animation
      this.todos.find((el) => el._id === id).state = "end";
      const timOut = setTimeout(() => {
        this.todoService
          .deleteTodo(id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe(
            (data) => {
              if (data) {
                this.todos = this.todos.filter((todo) => {
                  return todo._id !== id;
                });
                this.materialService.snackBar(data.message, "close", "done");
                clearTimeout(timOut);
              }
            },
            (error) => {
              this.materialService.snackBar(error, "close", "error");
              clearTimeout(timOut);
            }
          );
      }, 600);
    }
  }
}

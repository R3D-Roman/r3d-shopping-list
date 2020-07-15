import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { of, Subject } from "rxjs";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { switchMap, takeUntil } from "rxjs/operators";
import { TodoService } from "../shared/services/todo.service";
import { MaterialService } from "../shared/classes/material.service";
import { Todo } from "../shared/interfaces";

@Component({
  selector: "app-todo-page",
  templateUrl: "./todo-page.component.html",
  styleUrls: ["./todo-page.component.scss"],
})
export class TodoPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  todo: Todo;
  nameDisable: boolean = true;
  changeDisable: boolean = false;
  componentDestroyed$: Subject<boolean> = new Subject();
  priceTotal: number = 0;
  currency: string = "";
  constructor(
    private route: ActivatedRoute,
    private materialService: MaterialService,
    private todoService: TodoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    });

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params["id"]) {
            return this.todoService.getByIdTodo(params["id"]);
          }
          return of(null);
        }),
        takeUntil(this.componentDestroyed$)
      )
      .subscribe(
        (data) => {
          if (data) {
            this.todo = data;
            this.form.patchValue({
              name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            });
          }
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
        }
      );

    this.route.queryParams.subscribe((params: Params) => {
      if (params["todoCreated"]) {
        this.materialService.snackBar("Todo was created.", "close", "done");
      }
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  completeTodo() {
    const completed = {
      total: this.priceTotal,
      currency: this.currency,
      completed: true,
    };
    this.todoService
      .updateTodo(this.todo._id, completed)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.router.navigate(["/todos"]);
          this.materialService.snackBar(
            "todo was successfully completed",
            "close",
            "done"
          );
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
        }
      );
  }

  changeName() {
    this.form.controls["name"].enable();
    this.nameDisable = false;
  }

  priceTotalEvent(event) {
    this.priceTotal = event;
  }

  currencyEvent(event) {
    this.currency = event;
  }

  onSubmit() {
    this.form.disable();
    this.changeDisable = true;
    const name = {
      name: this.form.value.name,
    };
    this.todoService
      .updateTodo(this.todo._id, name)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.todo = data;
          this.changeDisable = false;
          this.materialService.snackBar("Todo is updated.", "close", "done");
        },
        (error) => {
          this.changeDisable = false;
          this.materialService.snackBar(error, "close", "error");
        }
      );
  }
}

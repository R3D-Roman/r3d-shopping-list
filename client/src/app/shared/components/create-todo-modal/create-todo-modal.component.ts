import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TodoService } from "../../services/todo.service";
import { Subject } from "rxjs";
import { MaterialService } from "../../classes/material.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-create-todo-modal",
  templateUrl: "./create-todo-modal.component.html",
  styleUrls: ["./create-todo-modal.component.scss"],
})
export class CreateTodoModalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private todoService: TodoService,
    private materialSnackBar: MaterialService,
    public dialogRef: MatDialogRef<CreateTodoModalComponent>,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
  onSubmit() {
    this.form.disable();
    this.todoService
      .createTodo(this.form.value)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.dialogRef.close();
          this.router.navigate(["todo", data._id], {
            queryParams: {
              todoCreated: true,
            },
          });
        },
        (error) => {
          this.materialSnackBar.snackBar(error, "close", "error");
          this.form.enable();
        }
      );
  }
}

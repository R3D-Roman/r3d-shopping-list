import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import { AuthService } from "../shared/services/auth.service";
import { MaterialService } from "../shared/classes/material.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-register-page",
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"],
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();
  date: Date = new Date();
  emailExists = "";
  constructor(
    private authService: AuthService,
    private materialSnackBar: MaterialService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    if (this.authService.decodeToken() > this.date) {
      this.router.navigate(["/todos"]);
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  emailCheck(event: Event) {
    if (!!this.onSubmit) {
      this.emailExists = "";
    }
  }

  onSubmit() {
    this.form.disable();
    this.authService
      .register(this.form.value)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.router.navigate(["/login"], {
            queryParams: {
              registered: true,
            },
          });
        },
        (error) => {
          this.materialSnackBar.snackBar(error, "close", "error");
          this.emailExists = null;
          this.form.enable();
        }
      );
  }
}

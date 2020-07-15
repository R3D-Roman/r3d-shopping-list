import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../shared/services/auth.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MaterialService } from "../shared/classes/material.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  componentDestroyed$: Subject<boolean> = new Subject();
  date: Date = new Date();
  errPass = "";
  errEmail = "";
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private materialService: MaterialService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
    this.route.queryParams.subscribe((params: Params) => {
      if (params["registered"]) {
        this.materialService.snackBar(
          "You successively registered",
          "close",
          "done"
        );
      } else if (params["accesseDenied"]) {
        this.materialService.snackBar(
          "You need to log In to the system.",
          "close",
          "error"
        );
      } else if (params["sessionFaild"]) {
        this.materialService.snackBar(
          "You session expired. Log in again",
          "close",
          "error"
        );
      } else if (params["loginOut"]) {
        this.materialService.snackBar(
          "You successively loged out.",
          "close",
          "error"
        );
      }
    });

    if (this.authService.decodeToken() > this.date) {
      this.router.navigate(["/todos"]);
    }
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  passCheck(event: Event) {
    if (!!this.onSubmit) {
      this.errPass = "";
    }
  }

  mailCheck(event: Event) {
    if (!!this.onSubmit) {
      this.errEmail = "";
    }
  }

  onSubmit() {
    this.form.disable();
    this.authService
      .login(this.form.value)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.router.navigate(["/todos"], {
            queryParams: {
              logedIn: true,
            },
          });
        },
        (error) => {
          this.errPass = null;
          this.errEmail = null;
          this.form.enable();
        }
      );
  }
}

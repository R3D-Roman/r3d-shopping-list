import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { MaterialService } from "./material.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private materialService: MaterialService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          Authorization: this.auth.getToken(),
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleAuthError(error);
      })
    );
  }

  handleAuthError(error: HttpErrorResponse): Observable<any> {
    // console.log(error.error.message);
    if (
      error.error.message !== "Invalid email or password. Try again." &&
      error.status === 401
    ) {
      this.router.navigate(["/login"], {
        queryParams: {
          sessionFaild: true,
        },
      });
      this.auth.logout();
    } else if (error.status === 404) {
      this.materialService.snackBar(error.error.message, "close", "error");
      console.log("Error: ", error.statusText);
    } else if (
      error.status === 500 ||
      error.status === 503 ||
      error.status === 504
    ) {
      this.materialService.snackBar(error.error, "close", "error");
      console.log("Error: ", error);
    } else {
      this.materialService.snackBar(error.error, "close", "error");
      console.log("Error: ", error);
    }

    return throwError(error);
  }
}

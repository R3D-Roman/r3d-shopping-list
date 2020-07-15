import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorHendlerService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error!";
    // Client-side errors
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message ? error.error.message : "Client-side error!";
    } else {
      // Server-side errors
      errorMessage = error.error.message ? error.error.message : "Server-side error!";
    }
    return throwError(errorMessage);
  }
}

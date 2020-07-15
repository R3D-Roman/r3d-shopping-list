import { Injectable } from "@angular/core";
import { User } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { ErrorHendlerService } from "../classes/error-hendler.service";
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthService {
 private token = null;

  constructor(
    private http: HttpClient,
    private errorHendlerService: ErrorHendlerService
  ) {}

  register(user: User): Observable<User> {
    return this.http
      .post<User>("/api/auth/register", user)
      .pipe(catchError(this.errorHendlerService.handleError));
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>("/api/auth/login", user).pipe(
      tap(({ token }) => {
        localStorage.setItem("auth-token", token);
        this.setToken(token);
      }),
      catchError(this.errorHendlerService.handleError)
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  decodeToken(token?: any) {
    if (localStorage.getItem("auth-token") == null) {
      return;
    }
    const decoded = jwt_decode(localStorage.getItem("auth-token"));

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  logout() {
    this.setToken(null);
    localStorage.clear();
  }
}

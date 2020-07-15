import { Injectable } from "@angular/core";
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  date: Date = new Date();
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.auth.isAuthenticated()) {
      return of(true);
    } else {
      this.auth.logout();
      this.router.navigate(["/login"], {
        queryParams: {
          accesseDenied: true,
        },
      });
      return of(false);
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state);
  }
}

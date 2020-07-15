import { Component, OnInit } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  date: Date = new Date();

  constructor(private authService: AuthService, private swUpdate: SwUpdate) {}

  ngOnInit() {
    const potencialToken = localStorage.getItem("auth-token");
    if (this.authService.decodeToken() > this.date) {
      this.authService.setToken(potencialToken);
    }

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }
}

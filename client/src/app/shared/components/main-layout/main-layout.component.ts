import { Component, OnInit, HostListener } from "@angular/core";
import {
  mobileMenuAnime,
  mobileMenuCloseAnime1,
  mobileMenuCloseAnime2,
  mobileMenuCloseAnime3,
} from "../../animation/app.animation";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
  animations: [
    mobileMenuAnime,
    mobileMenuCloseAnime1,
    mobileMenuCloseAnime2,
    mobileMenuCloseAnime3,
  ],
})
export class MainLayoutComponent implements OnInit {
  openMenu = false;
  animeMenu = "";
  public innerWidth: any;
  closeAnime = "start";
  linksShowHide = null;
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.animeMenu = "start";
      this.linksShowHide = true;
    } else {
      this.animeMenu = null;
      this.linksShowHide = null;
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.animeMenu = "start";
      this.linksShowHide = true;
    } else {
      this.animeMenu = null;
      this.linksShowHide = null;
    }
  }

  animate() {
    if (this.innerWidth <= 768) {
      this.animeMenu = this.animeMenu === "end" ? "start" : "end";
      this.closeAnime = this.closeAnime === "end" ? "start" : "end";
      if (this.animeMenu == "end") {
        this.linksShowHide = false;
      } else {
        this.linksShowHide = true;
      }
    } else {
      this.animeMenu = null;
    }
  }

  logOut(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(["/login"], {
      queryParams: {
        loginOut: true,
      },
    });
  }
}

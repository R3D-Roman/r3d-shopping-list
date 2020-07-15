import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthLayoutComponent } from "./shared/components/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { SiteLayoutComponent } from "./shared/components/site-layout/site-layout.component";
import { TodosPageComponent } from "./todos-page/todos-page.component";
import { TodoPageComponent } from "./todo-page/todo-page.component";
import { HistoryPageComponent } from "./history-page/history-page.component";
import { AuthGuard } from "./shared/classes/auth.guard";
import { ErrorPageComponent } from "./error-page/error-page.component";

const routes: Routes = [
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      { path: "", redirectTo: "/login", pathMatch: "full" },
      { path: "login", component: LoginPageComponent },
      { path: "register", component: RegisterPageComponent },
    ],
  },
  {
    path: "",
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "todos", component: TodosPageComponent },
      { path: "todo/:id", component: TodoPageComponent },
      { path: "history", component: HistoryPageComponent },
    ],
  },
  { path: "error", component: ErrorPageComponent },
  { path: "**", redirectTo: "/error" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

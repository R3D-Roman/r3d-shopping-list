import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgxPaginationModule } from "ngx-pagination";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./shared/material/material.module";
import { MainLayoutComponent } from "./shared/components/main-layout/main-layout.component";
import { AuthLayoutComponent } from "./shared/components/auth-layout/auth-layout.component";
import { SiteLayoutComponent } from "./shared/components/site-layout/site-layout.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { TodosPageComponent } from "./todos-page/todos-page.component";
import { TodoPageComponent } from "./todo-page/todo-page.component";
import { HistoryPageComponent } from "./history-page/history-page.component";
import { TokenInterceptor } from "./shared/classes/token.interceptor";
import { CreateTodoModalComponent } from "./shared/components/create-todo-modal/create-todo-modal.component";
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { PositionComponent } from "./shared/components/position/position.component";
import { EditPositionModalComponent } from "./shared/components/edit-position-modal/edit-position-modal.component";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { HistoryPositionsModalComponent } from "./history-page/history-positions-modal/history-positions-modal.component";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    LoginPageComponent,
    RegisterPageComponent,
    TodosPageComponent,
    TodoPageComponent,
    HistoryPageComponent,
    CreateTodoModalComponent,
    LoaderComponent,
    PositionComponent,
    EditPositionModalComponent,
    ErrorPageComponent,
    HistoryPositionsModalComponent,
  ],
  entryComponents: [CreateTodoModalComponent, EditPositionModalComponent, HistoryPositionsModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

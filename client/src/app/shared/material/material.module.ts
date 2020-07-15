import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

const material = [
  MatToolbarModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatSnackBarModule,
  MatDialogModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {}

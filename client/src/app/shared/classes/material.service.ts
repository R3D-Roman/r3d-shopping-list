import {
  MatSnackBar,
  MatSnackBarVerticalPosition,
  MatSnackBarConfig,
} from "@angular/material/snack-bar";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MaterialService {
  verticalPosition: MatSnackBarVerticalPosition = "top";
  constructor(private _snackBar: MatSnackBar) {}

  snackBar(message: string, action: string, panelClass: string) {
    let sneckBarRef = this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: this.verticalPosition,
      panelClass: [panelClass]
    });

    sneckBarRef.afterDismissed();
    sneckBarRef.onAction().subscribe(() => {

    });
  }
}

import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CreateTodoModalComponent } from "../create-todo-modal/create-todo-modal.component";
import { ShoppingCategory } from "../../interfaces";
import { Position } from "../../interfaces";
import { PositionService } from "../../services/position.service";
import { MaterialService } from "../../classes/material.service";
import { Subscription, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-edit-position-modal",
  templateUrl: "./edit-position-modal.component.html",
  styleUrls: ["./edit-position-modal.component.scss"],
})
export class EditPositionModalComponent implements OnInit, OnDestroy {
  position: Position;
  form: FormGroup;
  selectedValue: string;
  todoId: string;
  componentDestroyed$: Subject<boolean> = new Subject();
  shoppingCategory: ShoppingCategory[] = [
    { value: "beverages", viewValue: "Beverages" },
    { value: "bread / bakery", viewValue: "Bread/Bakery" },
    { value: "fruit and vegetables", viewValue: "Fruit and Vegetables" },
    { value: "milk / cheese", viewValue: "Milk/Cheese" },
    { value: "meat / fish / poultry", viewValue: "Meat/Fish/Poultry" },
    { value: "sweets / candy", viewValue: "Sweets/Candy" },
    { value: "grain", viewValue: "Grain" },
    { value: "sauces / mayo / oil", viewValue: "Sauces/Mayo/Oil" },
    { value: "seasoning and spices", viewValue: "Seasoning and Spices" },
    { value: "alcoholic drinks", viewValue: "Alcoholic Drinks" },
    { value: "cleaners", viewValue: "Cleaners" },
    { value: "paper goods", viewValue: "Paper Goods" },
    { value: "personal care", viewValue: "Personal Care" },
    { value: "other", viewValue: "Other" },
  ];
  shoppingCurrency: ShoppingCategory[] = [
    { value: "usd", viewValue: "USD" },
    { value: "eur", viewValue: "EUR" },
    { value: "pln", viewValue: "PLN" },
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTodoModalComponent>,
    private positionService: PositionService,
    private materialService: MaterialService
  ) {}

  ngOnInit() {
    this.position = this.data;
    this.form = new FormGroup({
      name: new FormControl(this.position.name, [Validators.required]),
      quantity: new FormControl(this.position.quantity, [Validators.required]),
      price: new FormControl(this.position.cost, [Validators.required]),
      currency: new FormControl(this.position.currency, [Validators.required]),
      category: new FormControl(this.position.category, [Validators.required]),
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  onSubmit() {
    this.form.disable();
    this.todoId = this.position._id;
    const newPosition = {
      name: this.form.value.name,
      quantity: this.form.value.quantity,
      cost: this.form.value.price,
      currency: this.form.value.currency,
      category: this.form.value.category,
      todo: this.position.todo,
      _id: this.position._id,
    };

    this.positionService
      .updatePosition(newPosition, this.todoId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          if (data) {
            this.form.enable();
            this.dialogRef.close(data);
          }
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
        }
      );
  }
}

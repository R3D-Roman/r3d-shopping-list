import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatDialogConfig, MatDialog } from "@angular/material/dialog";
import { EditPositionModalComponent } from "../edit-position-modal/edit-position-modal.component";
import { ShoppingCategory, Position } from "../../interfaces";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { PositionService } from "../../services/position.service";
import { MaterialService } from "../../classes/material.service";
import { Subject } from "rxjs";
import { DeleteMessage } from "../../interfaces";
import {
  deleteListsAnimation,
  showMenuForposition,
  hideMenuForposition,
} from "../../animation/app.animation";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-position",
  templateUrl: "./position.component.html",
  styleUrls: ["./position.component.scss"],
  animations: [deleteListsAnimation, showMenuForposition, hideMenuForposition],
})
export class PositionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Input() todoId: string;
  selectedValue: string;
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
  positions: Position[] = [];
  componentDestroyed$: Subject<boolean> = new Subject();
  completed: boolean = false;
  completedId: string;
  disabled: boolean = false;
  loader: boolean = false;
  priceTotal: number = 0;
  @Output() priceTotalRef = new EventEmitter();
  @Output() currencyRef = new EventEmitter();
  totalCurrency: string;
  showAddPositionMenu: boolean = false;
  fadeIn: any;
  fadeOut: any;
  constructor(
    public dialog: MatDialog,
    private positionService: PositionService,
    private materialService: MaterialService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      quantity: new FormControl(1, [Validators.required]),
      price: new FormControl(0, [Validators.required]),
      currency: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
    });

    // console.log(this.todoId);
    this.positionService
      .getAllPositions(this.todoId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          if (data) {
            this.positions = data;
            this.positions = this.positions.map((res) => {
              return {
                ...res,
                state: "start",
              };
            });
            this.positions.reverse();
            this.positions.sort((a, b) => {
              return a.category > b.category ? 1 : -1;
            });
            this.computePrice();
            const currencyVal = this.positions;
            currencyVal.forEach((element) => {
              this.totalCurrency = element.currency;
              this.currencyRef.emit(this.totalCurrency);
              this.priceTotalRef.emit(this.priceTotal);
              this.form.setValue({
                name: null,
                price: 0,
                category: null,
                quantity: 1,
                currency: currencyVal ? element.currency : null,
              });
            });
          }
          this.loader = true;
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
        }
      );
  }

  // Update position Dialog
  openDialog(position: Position) {
    if (position.completed == true) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = "300px";
    dialogConfig.data = position;
    const dialogRef = this.dialog.open(
      EditPositionModalComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.materialService.snackBar(
            "Position updated successfully.",
            "close",
            "done"
          );
          const idx = this.positions.findIndex((p) => {
            return p._id === result._id;
          });
          result.state = "start";
          this.positions[idx] = result;
          this.computePrice();
          this.priceTotalRef.emit(this.priceTotal);
        }
      },
      (error) => {
        this.materialService.snackBar(error, "close", "error");
      }
    );
  }

  // currency treck
  identify(item) {
    return item._id;
  }

  // Update completed position
  toggleUpdatePosition(event?, id?) {
    this.disabled = true;
    this.completed = event.checked;
    this.completedId = id;
    const newPosition = {
      _id: id,
      todo: this.todoId,
      completed: this.completed,
    };
    this.positionService
      .updatePosition(newPosition, this.completedId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.positions.find((el) => el._id === id).completed = data.completed;
          this.disabled = false;
        },
        (error) => {
          this.materialService.snackBar(error, "close", "error");
          this.disabled = false;
        }
      );
  }

  checBoxStopPropagation() {
    event.stopPropagation();
  }

  // delete position
  deletePosition(event, id: string, name: string) {
    event.stopPropagation();
    const decision = confirm(`You shure wat to delete the posotion ${name}?`);
    if (decision) {
      // animation
      this.positions.find((el) => el._id === id).state = "end";
      const timOut = setTimeout(() => {
        this.positionService
          .deletePosition(id)
          .pipe(takeUntil(this.componentDestroyed$))
          .subscribe(
            (response: DeleteMessage) => {
              this.positions = this.positions.filter((position) => {
                return position._id !== id;
              });
              if (this.positions.length === 0) {
                this.totalCurrency = "";
                this.form.setValue({
                  name: null,
                  quantity: 1,
                  price: 0,
                  category: null,
                  currency: null,
                });
              }
              this.computePrice();
              this.priceTotalRef.emit(this.priceTotal);
              this.materialService.snackBar(response.message, "close", "done");
              clearTimeout(timOut);
            },
            (error) => {
              this.materialService.snackBar(error, "close", "error");
              clearTimeout(timOut);
            }
          );
      }, 600);
    }
  }

  // total cost of positions
  computePrice() {
    this.priceTotal = this.positions.reduce((total, item) => {
      return (total += item.cost * item.quantity);
    }, 0);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  // create position
  onSubmit(formDirective: FormGroupDirective) {
    this.form.disable();
    let currency = this.form.value.currency;
    let num = this.form.value.price.toString().slice(0, 4);
    let parse = parseFloat(num);
    const newPosition = {
      name: this.form.value.name,
      quantity: this.form.value.quantity,
      cost: parse,
      category: this.form.value.category,
      currency: currency,
      todo: this.todoId,
    };
    this.positionService
      .createPosition(newPosition)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        (data) => {
          this.form.enable();
          data.state = "start";
          this.positions.unshift(data);
          this.positions.sort((a, b) => {
            return a.category > b.category ? 1 : -1;
          });
          this.computePrice();
          this.priceTotalRef.emit(this.priceTotal);
          this.materialService.snackBar(
            "Position was fully created.",
            "close",
            "done"
          );
          this.totalCurrency = data.currency;
          this.currencyRef.emit(this.totalCurrency);
          formDirective.resetForm();
          this.form.reset({ price: 0, currency: currency, quantity: 1 });
        },
        (error) => {
          this.form.enable();
          this.materialService.snackBar(error, "close", "error");
        }
      );
  }
}

import { Component, OnInit, Inject, Input } from "@angular/core";
import { PositionService } from "src/app/shared/services/position.service";
import { Subject } from "rxjs";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { Position } from "../../shared/interfaces";
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: "app-history-positions-modal",
  templateUrl: "./history-positions-modal.component.html",
  styleUrls: ["./history-positions-modal.component.scss"],
})
export class HistoryPositionsModalComponent implements OnInit {
  positions: Position[] = [];
  componentDestroyed$: Subject<boolean> = new Subject();
  total: number = 0;
  currency: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private positionService: PositionService,
    private materialService: MaterialService
  ) {}

  ngOnInit() {
    this.positionService
      .getAllPositions(this.data.id)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((data) => {
        this.positions = data;
      }, (error) => {
        this.materialService.snackBar(error, "close", "error");
      });
      this.total = this.data.total;
      this.currency = this.data.currency;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}

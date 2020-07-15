import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ErrorHendlerService } from "../classes/error-hendler.service";
import { Position } from "../interfaces";
import { Observable } from "rxjs";
import { catchError, delay } from "rxjs/operators";
import { DeleteMessage } from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class PositionService {
  constructor(
    private http: HttpClient,
    private errorHendlerService: ErrorHendlerService
  ) {}

  getAllPositions(todoId: string): Observable<Position[]> {
    return this.http
      .get<Position[]>(`/api/position/${todoId}`)
      .pipe(delay(1500), catchError(this.errorHendlerService.handleError));
  }

  createPosition(position: Position): Observable<Position> {
    return this.http
      .post<Position>("/api/position", position)
      .pipe(delay(1500), catchError(this.errorHendlerService.handleError));
  }

  updatePosition(position: Position, id: string): Observable<Position> {
    return this.http
      .patch<Position>(`/api/position/${id}`, position)
      .pipe(delay(1500), catchError(this.errorHendlerService.handleError));
  }

  deletePosition(id: string): Observable<DeleteMessage> {
    return this.http
      .delete<DeleteMessage>(`/api/position/${id}`)
      .pipe(catchError(this.errorHendlerService.handleError));
  }
}

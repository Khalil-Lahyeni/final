import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TrainRecord {
  trainId: string;
  pacisStatus: string;
  cctvStatus: string;
  rearViewStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  private apiUrl = `${environment.apiGatewayUrl}/api/trains/collector/trains`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les trains
   */
  getAllTrains(): Observable<TrainRecord[]> {
    return this.http.get<TrainRecord[]>(`${this.apiUrl}`);
  }

  /**
   * Récupère les détails d'un train spécifique
   */
  getTrainById(trainId: string): Observable<TrainRecord> {
    return this.http.get<TrainRecord>(`${this.apiUrl}/${trainId}`);
  }

}
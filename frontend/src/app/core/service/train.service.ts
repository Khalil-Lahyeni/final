import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TrainRecord {
  train_id: string;
  pacis_status: string;
  cctv_status: string;
  rear_view_status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  private apiUrl = `${environment.apiGatewayUrl}/api/trains`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste de tous les trains
   */
  getAllTrains(): Observable<TrainRecord[]> {
    return this.http.get<TrainRecord[]>(`${this.apiUrl}`, {
      withCredentials: true
    });
  }

  /**
   * Récupère les détails d'un train spécifique
   */
  getTrainById(trainId: string): Observable<TrainRecord> {
    return this.http.get<TrainRecord>(`${this.apiUrl}/${trainId}`, {
      withCredentials: true
    });
  }

  /**
   * Récupère les statuts de tous les trains
   */
  getTrainsStatus(): Observable<TrainRecord[]> {
    return this.http.get<TrainRecord[]>(`${this.apiUrl}/status`, {
      withCredentials: true
    });
  }
}

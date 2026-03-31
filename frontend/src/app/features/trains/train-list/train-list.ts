import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainService, TrainRecord } from '../../../core/service/train.service';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './train-list.html',
  styleUrl: './train-list.scss'
})
export class TrainListComponent implements OnInit {

  trains: TrainRecord[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    this.loadTrains();
  }

  /**
   * Charge la liste de tous les trains
   */
  loadTrains(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.trainService.getAllTrains().subscribe({
      next: (data) => {
        this.trains = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des trains:', error);
        this.errorMessage = 'Impossible de charger la liste des trains. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Retourne la classe CSS basée sur le statut
   */
  getStatusClass(status: string): string {
    if (!status) return 'status-unknown';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'ok' || statusLower === 'active' || statusLower === 'functional') {
      return 'status-ok';
    } else if (statusLower === 'warning' || statusLower === 'maintenance') {
      return 'status-warning';
    } else if (statusLower === 'error' || statusLower === 'offline' || statusLower === 'disabled') {
      return 'status-error';
    }
    
    return 'status-unknown';
  }

  /**
   * Retourne l'icône du statut
   */
  getStatusIcon(status: string): string {
    if (!status) return '?';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'ok' || statusLower === 'active' || statusLower === 'functional') {
      return '✓';
    } else if (statusLower === 'warning' || statusLower === 'maintenance') {
      return '⚠';
    } else if (statusLower === 'error' || statusLower === 'offline' || statusLower === 'disabled') {
      return '✕';
    }
    
    return '?';
  }

  /**
   * Rafraîchit la liste des trains
   */
  refreshTrains(): void {
    this.loadTrains();
  }
}

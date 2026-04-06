import { Component, OnInit } from '@angular/core';
import { TrainService, TrainRecord } from '../../../core/service/train.service';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [],
  templateUrl: './train-list.html',
  styleUrl: './train-list.scss'
})
export class TrainList implements OnInit {

  trains: TrainRecord[] = [];
  loading = true;

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    this.trainService.getAllTrains().subscribe({
      next: (data) => {
        this.trains = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API :', err);
        this.loading = false;
      }
    });
  }

}
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainService, TrainRecord } from '../../../core/service/train.service';
import { Subject, catchError, interval, of, startWith, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [],
  templateUrl: './train-list.html',
  styleUrl: './train-list.scss'
})
export class TrainList implements OnInit, OnDestroy {

  trains: TrainRecord[] = [];
  loading = true;
  private readonly destroy$ = new Subject<void>();

  constructor(private trainService: TrainService) {}

  ngOnInit(): void {
    interval(3000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.trainService.getAllTrains().pipe(
            catchError((err) => {
              console.error('Erreur API :', err);
              return of([] as TrainRecord[]);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.trains = data;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
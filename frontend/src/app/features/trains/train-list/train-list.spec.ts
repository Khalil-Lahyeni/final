import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainListComponent } from './train-list';
import { TrainService } from '../../../core/service/train.service';
import { of, throwError } from 'rxjs';

describe('TrainListComponent', () => {
  let component: TrainListComponent;
  let fixture: ComponentFixture<TrainListComponent>;
  let trainService: jasmine.SpyObj<TrainService>;

  const mockTrains = [
    {
      train_id: 'TRAIN-001',
      pacis_status: 'OK',
      cctv_status: 'OK',
      rear_view_status: 'OK'
    },
    {
      train_id: 'TRAIN-002',
      pacis_status: 'Warning',
      cctv_status: 'OK',
      rear_view_status: 'Error'
    }
  ];

  beforeEach(async () => {
    const trainServiceSpy = jasmine.createSpyObj('TrainService', [
      'getAllTrains',
      'getTrainById',
      'getTrainsStatus'
    ]);

    await TestBed.configureTestingModule({
      imports: [TrainListComponent],
      providers: [
        { provide: TrainService, useValue: trainServiceSpy }
      ]
    }).compileComponents();

    trainService = TestBed.inject(TrainService) as jasmine.SpyObj<TrainService>;
    fixture = TestBed.createComponent(TrainListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trains on init', () => {
    trainService.getAllTrains.and.returnValue(of(mockTrains));

    fixture.detectChanges();

    expect(trainService.getAllTrains).toHaveBeenCalled();
    expect(component.trains.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when loading trains', () => {
    const error = new Error('API Error');
    trainService.getAllTrains.and.returnValue(throwError(() => error));

    fixture.detectChanges();

    expect(component.errorMessage).toContain('Impossible de charger');
    expect(component.isLoading).toBe(false);
  });

  it('should return correct status class for OK status', () => {
    const statusClass = component.getStatusClass('OK');
    expect(statusClass).toBe('status-ok');
  });

  it('should return correct status class for warning status', () => {
    const statusClass = component.getStatusClass('Warning');
    expect(statusClass).toBe('status-warning');
  });

  it('should return correct status class for error status', () => {
    const statusClass = component.getStatusClass('Error');
    expect(statusClass).toBe('status-error');
  });

  it('should refresh trains', () => {
    trainService.getAllTrains.and.returnValue(of(mockTrains));

    component.refreshTrains();

    expect(trainService.getAllTrains).toHaveBeenCalled();
  });
});

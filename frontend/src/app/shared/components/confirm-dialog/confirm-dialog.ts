import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss'
})
export class ConfirmDialog {
  readonly dialogService = inject(DialogService);

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (this.dialogService.currentDialog()) {
      this.dialogService.cancel();
    }
  }
}

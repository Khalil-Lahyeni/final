import { Injectable, signal } from '@angular/core';

export interface ConfirmDialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  closeOnBackdrop?: boolean;
}

export interface ConfirmDialogViewModel {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  danger: boolean;
  closeOnBackdrop: boolean;
}

interface ConfirmDialogRequest {
  config: ConfirmDialogViewModel;
  resolve: (result: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly queue: ConfirmDialogRequest[] = [];
  private readonly currentRequest = signal<ConfirmDialogRequest | null>(null);

  readonly currentDialog = signal<ConfirmDialogViewModel | null>(null);

  openConfirm(options: ConfirmDialogOptions = {}): Promise<boolean> {
    const config = this.withDefaults(options);

    return new Promise<boolean>((resolve) => {
      this.queue.push({ config, resolve });
      this.openNext();
    });
  }

  openConfirmLogout(): Promise<boolean> {
    return this.openConfirm({
      title: 'Confirmer la deconnexion',
      message: 'Voulez-vous vraiment vous deconnecter ?',
      confirmText: 'Se deconnecter',
      cancelText: 'Annuler',
      danger: true,
      closeOnBackdrop: true
    });
  }

  confirm(): void {
    this.resolveCurrent(true);
  }

  cancel(): void {
    this.resolveCurrent(false);
  }

  backdropClick(): void {
    const request = this.currentRequest();
    if (request?.config.closeOnBackdrop) {
      this.cancel();
    }
  }

  private resolveCurrent(result: boolean): void {
    const request = this.currentRequest();
    if (!request) {
      return;
    }

    request.resolve(result);
    this.currentRequest.set(null);
    this.currentDialog.set(null);
    this.openNext();
  }

  private openNext(): void {
    if (this.currentRequest() || this.queue.length === 0) {
      return;
    }

    const nextRequest = this.queue.shift() ?? null;
    this.currentRequest.set(nextRequest);
    this.currentDialog.set(nextRequest?.config ?? null);
  }

  private withDefaults(options: ConfirmDialogOptions): ConfirmDialogViewModel {
    return {
      title: options.title ?? 'Confirmation',
      message: options.message ?? 'Voulez-vous confirmer cette action ?',
      confirmText: options.confirmText ?? 'Confirmer',
      cancelText: options.cancelText ?? 'Annuler',
      danger: options.danger ?? false,
      closeOnBackdrop: options.closeOnBackdrop ?? false
    };
  }
}

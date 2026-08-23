import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppErrorService {
  messageFromError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const serverMessage =
        typeof error.error === 'string'
          ? error.error
          : typeof error.error?.message === 'string'
            ? error.error.message
            : '';

      return serverMessage && serverMessage !== 'Unknown Error' ? serverMessage : fallback;
    }

    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    return fallback;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  add(message: Omit<ToastMessage, 'id'>) {
    const id = Date.now().toString();
    const toastMessage: ToastMessage = {
      ...message,
      id,
      life: message.life || 3000
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, toastMessage]);

    if (message.life !== 0) {
      setTimeout(() => {
        this.remove(id);
      }, toastMessage.life);
    }
  }

  success(summary: string, detail?: string) {
    this.add({ severity: 'success', summary, detail });
  }

  info(summary: string, detail?: string) {
    this.add({ severity: 'info', summary, detail });
  }

  warn(summary: string, detail?: string) {
    this.add({ severity: 'warn', summary, detail });
  }

  error(summary: string, detail?: string) {
    this.add({ severity: 'error', summary, detail });
  }

  remove(id: string) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next(currentMessages.filter(m => m.id !== id));
  }

  clear() {
    this.messagesSubject.next([]);
  }
}

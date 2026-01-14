import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (message of messages; track message.id) {
        <div [class]="'toast toast-' + message.severity" [@slideIn]>
          <div class="toast-content">
            <div class="toast-header">
              <span class="toast-icon" [class]="'pi pi-' + getSeverityIcon(message.severity)"></span>
              <span class="toast-summary">{{ message.summary }}</span>
            </div>
            @if (message.detail) {
              <div class="toast-detail">{{ message.detail }}</div>
            }
          </div>
          <button class="toast-close" (click)="toastService.remove(message.id)">
            <span class="pi pi-times"></span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideInRight 0.3s ease-out;
    }

    .toast-success {
      background-color: #fce4ec;
      color: #c2185b;
      border-left: 4px solid #e91e63;
    }

    .toast-info {
      background-color: #e3f2fd;
      color: #1565c0;
      border-left: 4px solid #2196f3;
    }

    .toast-warn {
      background-color: #fff3e0;
      color: #e65100;
      border-left: 4px solid #ff9800;
    }

    .toast-error {
      background-color: #ffebee;
      color: #c62828;
      border-left: 4px solid #f44336;
    }

    .toast-content {
      flex: 1;
    }

    .toast-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .toast-summary {
      font-weight: 600;
      font-size: 14px;
    }

    .toast-detail {
      font-size: 13px;
      margin-top: 4px;
      opacity: 0.9;
    }

    .toast-close {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    .toast-close:hover {
      opacity: 0.7;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent implements OnInit {
  messages: any[] = [];

  constructor(public toastService: ToastService) {}

  ngOnInit() {
    this.toastService.messages$.subscribe(messages => {
      this.messages = messages;
    });
  }

  getSeverityIcon(severity: string): string {
    const icons: { [key: string]: string } = {
      success: 'check-circle',
      info: 'info-circle',
      warn: 'exclamation-triangle',
      error: 'times-circle'
    };
    return icons[severity] || 'info-circle';
  }
}

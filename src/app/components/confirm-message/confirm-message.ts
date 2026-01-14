import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-message.html',
  styleUrl: './confirm-message.css'
})
export class ConfirmMessageComponent {
  @Input() show = false;
  @Input() message = '';

  onClick() {
    // Permette di chiudere cliccando
  }
}

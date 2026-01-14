import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { WorkoutSession } from '../../models/workout-session';

@Component({
  selector: 'app-session-history-page',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './session-history-page.html',
  styleUrl: './session-history-page.css'
})
export class SessionHistoryPageComponent {
  @Input() sessions: WorkoutSession[] = [];
  @Output() sessionDeleted = new EventEmitter<number>();
  @Output() sessionDuplicated = new EventEmitter<WorkoutSession>();
  @Output() sessionEdited = new EventEmitter<WorkoutSession>();
  @Output() backClicked = new EventEmitter<void>();

  expandedSessions: { [key: number]: boolean } = {};

  toggleSessionDetails(index: number) {
    this.expandedSessions[index] = !this.expandedSessions[index];
  }

  editSession(session: WorkoutSession) {
    this.sessionEdited.emit(session);
  }

  deleteSession(id: number) {
    if (confirm('Sei sicuro di voler eliminare questa sessione?')) {
      this.sessionDeleted.emit(id);
    }
  }

  duplicateSession(session: WorkoutSession) {
    const newSession: WorkoutSession = {
      ...session,
      id: Date.now(),
      date: new Date().toISOString(),
      name: `${session.name} (Copia)`
    };
    this.sessionDuplicated.emit(newSession);
  }

  goBack() {
    this.backClicked.emit();
  }
}

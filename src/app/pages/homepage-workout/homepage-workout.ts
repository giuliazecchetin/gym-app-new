import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-homepage-workout',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="homepage-container content">
      <h1> Il Tuo Diario di Allenamento</h1>

      <div class="button-container">
        <p-button class="btn-insert" icon="pi pi-plus" label="INSERISCI NUOVO ESERCIZIO" severity="help"
                  (click)="insertExercise.emit()"></p-button>
        <p-button class="btn-session" icon="pi pi-calendar" label="CREA SESSIONE" severity="help"
                  (click)="createSession.emit()"></p-button>
        <p-button class="btn-history" icon="pi pi-history" label="VISUALIZZA SESSIONI" severity="help"
                  (click)="viewHistory.emit()"></p-button>
      </div>
    </div>
  `,
  styles: [`
    .homepage-container {
      margin: 0 auto;
      background: transparent;
      border: none;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      animation: slideIn 0.5s ease-out;
      padding: 2rem 1rem;
    }

    h1 {
      color: #333;
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0 0 2rem 0;
      padding: 0;
      border: none;
      background: none;
    }

    .button-container {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class HomepageWorkoutComponent {
  @Output() insertExercise = new EventEmitter<void>();
  @Output() createSession = new EventEmitter<void>();
  @Output() viewHistory = new EventEmitter<void>();
}

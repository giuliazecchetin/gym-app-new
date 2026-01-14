import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Exercise } from '../../models/exercise';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './exercise-form.html',
  styleUrl: './exercise-form.css'
})
export class ExerciseFormComponent {
  @Input() isOpen = false;
  @Input() isEdit = false;
  @Input() muscleGroups: string[] = [];
  @Input() formData: Exercise = {
    id: 0,
    name: '',
    muscleGroup: '',
    sets: 3,
    reps: 10,
    weightKg: undefined,
    notes: ''
  };
  @Output() save = new EventEmitter<Exercise>();
  @Output() close = new EventEmitter<void>();
}

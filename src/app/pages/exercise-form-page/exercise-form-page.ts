import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exercise } from '../../models/exercise';
import { ExerciseFormComponent } from '../../components/exercise-form/exercise-form';
import { ConfirmMessageComponent } from '../../components/confirm-message/confirm-message';

@Component({
  selector: 'app-exercise-form-page',
  standalone: true,
  imports: [ExerciseFormComponent, ConfirmMessageComponent],
  templateUrl: './exercise-form-page.html',
  styleUrl: './exercise-form-page.css'
})
export class ExerciseFormPageComponent {
  @Input() isOpen: boolean = false;
  @Input() isEdit: boolean = false;
  @Input() formData: Exercise = {
    id: 0,
    name: '',
    muscleGroup: '',
    sets: 3,
    reps: 10,
    weightKg: undefined,
    notes: ''
  };
  @Input() muscleGroups: string[] = [];
  @Input() showConfirm: boolean = false;
  @Input() confirmMessage: string = '';

  @Output() save = new EventEmitter<Exercise>();
  @Output() close = new EventEmitter<void>();

  onSave(exercise: Exercise) {
    this.save.emit(exercise);
  }

  onClose() {
    this.close.emit();
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Exercise } from '../../models/exercise';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css'
})
export class ExerciseListComponent {
  @Input() exercises: Exercise[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
}

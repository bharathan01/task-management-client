import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task.service';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
  const plannedDate = control.get('plannedDate')?.value;
  const dueDate = control.get('dueDate')?.value;

  if (plannedDate && dueDate && new Date(dueDate) < new Date(plannedDate)) {
    return { dateMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.data?.task?.title || '', Validators.required],
      description: [this.data?.task?.description || ''],
      storyPoints: [this.data?.task?.storyPoints || null, [Validators.required, Validators.min(1)]],
      priority: [this.data?.task?.priority || '', Validators.required],
      status: [this.data?.task?.status || 'Backlog', Validators.required],
      plannedDate: [this.data?.task?.plannedDate || null, Validators.required],
      dueDate: [this.data?.task?.dueDate || null]
    }, { validators: dateValidator });
  }

  async save(): Promise<void> {
    if (this.taskForm.invalid) return;

    this.isSaving = true;
    try {
      if (this.data?.task?.id) {
        // Edit mode
        const response = await this.taskService.updateTask(this.data.task.id, this.taskForm.value);
        if (response.status) {
          this.snackBar.open('Task updated successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.dialogRef.close(true); // Signal success to parent to refresh
        }
      } else {
        // Create mode
        const response = await this.taskService.createTask(this.taskForm.value);
        if (response.status) {
          this.snackBar.open('Task created successfully', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
          this.dialogRef.close(true); // Signal success to parent to refresh
        }
      }
    } catch (error: any) {
      console.error('Failed to save task', error);
      const errorMsg = error.error?.message || 'Failed to save task';
      this.snackBar.open(errorMsg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
    } finally {
      this.isSaving = false;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

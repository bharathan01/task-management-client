import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/interfaces/task.interface';
import { getPriorityColorHex } from '../../../core/constants/task.constants';

@Component({
  selector: 'app-task-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-view-dialog.component.html',
  styleUrl: './task-view-dialog.component.css'
})
export class TaskViewDialogComponent implements OnInit {
  task?: Task;
  isLoading = true;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<TaskViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskId: string },
    private taskService: TaskService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      const response = await this.taskService.getTask(this.data.taskId);
      if (response.status && response.data) {
        this.task = response.data;
      } else {
        this.errorMessage = response.message || 'Failed to load task details.';
      }
    } catch (error: any) {
      console.error('Failed to load task details', error);
      this.errorMessage = error.error?.message || 'Failed to load task details.';
    } finally {
      this.isLoading = false;
    }
  }

  getPriorityColor(priority?: string): string {
    if (!priority) return '#9e9e9e';
    return getPriorityColorHex(priority);
  }

  getPriorityColorLight(priority?: string): string {
    if (!priority) return '#f3f4f6';
    return getPriorityColorHex(priority) + '15'; // Soft 8% opacity background
  }

  close(): void {
    this.dialogRef.close();
  }
}

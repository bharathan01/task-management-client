import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { getPriorityColorHex } from '../../core/constants/task.constants';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/interfaces/task.interface';
import { TaskViewDialogComponent } from '../../shared/components/task-view-dialog/task-view-dialog.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatCardModule, MatIconModule, MatChipsModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {
  dailyLimit = 8;
  weeklyLimit = 40;

  backlog: Task[] = [];
  planned: Task[] = [];
  inProgress: Task[] = [];
  completed: Task[] = [];

  constructor(
    private snackBar: MatSnackBar, 
    private dialog: MatDialog,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    try {
      const response = await this.taskService.getTasks({ limit: 1000 });
      if (response.status && response.data) {
        const allTasks = response.data.items;
        this.backlog = allTasks.filter(t => t.status === 'Backlog');
        this.planned = allTasks.filter(t => t.status === 'Planned');
        this.inProgress = allTasks.filter(t => t.status === 'In_Progress');
        this.completed = allTasks.filter(t => t.status === 'Completed');
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
      this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
    }
  }

  openTaskDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task: task }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.loadTasks();
      }
    });
  }

  viewTask(task: Task) {
    if (!task.id) return;
    this.dialog.open(TaskViewDialogComponent, {
      width: '600px',
      data: { taskId: task.id }
    });
  }

  async drop(event: CdkDragDrop<Task[]>, newStatus: 'Backlog' | 'Planned' | 'In_Progress' | 'Completed') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      if (task.status === 'Completed' && newStatus === 'Backlog') {
        this.snackBar.open('Cannot move a completed task back to Backlog.', 'Close', { duration: 3000 });
        return;
      }
      if (task.status === 'Backlog' && newStatus === 'Planned') {
        if (!this.checkCapacity(task)) {
          return;
        }
      }
      
      // Move is valid, transfer array item
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      // Update status in local array
      const movedTask = event.container.data[event.currentIndex];
      movedTask.status = newStatus;
      
      try {
        const response = await this.taskService.patchTaskStatus(movedTask.id!, newStatus);
        if (response.status) {
          this.snackBar.open('Task status updated successfully', 'Close', { duration: 3000 });
        }
      } catch (error: any) {
        console.error('Failed to update task status', error);
        const errorMsg = error.error?.message || 'Failed to update task status';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        // Revert by reloading the state from the backend
        this.loadTasks();
      }
    }
  }

  private checkCapacity(taskToMove: Task): boolean {
    const allPlannedTasks = [...this.planned, ...this.inProgress, ...this.completed];
    
    const taskMoveDate = new Date(taskToMove.plannedDate);

  
    const dailyPoints = allPlannedTasks
      .filter(t => new Date(t.plannedDate).toDateString() === taskMoveDate.toDateString())
      .reduce((sum, t) => sum + t.storyPoints, 0);

    if (dailyPoints + taskToMove.storyPoints > this.dailyLimit) {
      this.snackBar.open(`Daily Capacity Exceeded. Limit: ${this.dailyLimit}, Already Planned: ${dailyPoints}, Task: ${taskToMove.storyPoints}`, 'Close', { duration: 4000 });
      return false;
    }
    const taskWeek = this.getWeekNumber(taskMoveDate);
    const weeklyPoints = allPlannedTasks
      .filter(t => this.getWeekNumber(new Date(t.plannedDate)) === taskWeek)
      .reduce((sum, t) => sum + t.storyPoints, 0);

    if (weeklyPoints + taskToMove.storyPoints > this.weeklyLimit) {
      this.snackBar.open(`Weekly Capacity Exceeded. Limit: ${this.weeklyLimit}, Already Planned: ${weeklyPoints}, Task: ${taskToMove.storyPoints}`, 'Close', { duration: 4000 });
      return false;
    }

    return true;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  }

  getPriorityColorHex(priority: string): string {
    return getPriorityColorHex(priority);
  }
}

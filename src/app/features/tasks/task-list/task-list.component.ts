import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { getPriorityColorHex } from '../../../core/constants/task.constants';
import { TaskDialogComponent } from '../../../shared/components/task-dialog/task-dialog.component';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../core/interfaces/task.interface';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TaskViewDialogComponent } from '../../../shared/components/task-view-dialog/task-view-dialog.component';



@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'storyPoints', 'priority', 'status', 'plannedDate', 'dueDate', 'actions'];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTitle = '';
  filterPriority = '';
  filterStatus = '';

  totalTasks = 0;
  isLoading = false;

  // Track search timeout for debouncing
  private searchTimeout: any;

  constructor(
    private dialog: MatDialog, 
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initial load will happen in ngAfterViewInit to ensure paginator is ready
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // Load initial tasks
    this.loadTasks();

    // Listen for paginator changes
    this.paginator.page.subscribe(() => {
      this.loadTasks();
    });
  }

  async loadTasks() {
    this.isLoading = true;
    try {
      const response = await this.taskService.getTasks({
        page: this.paginator.pageIndex + 1, // API is 1-indexed, paginator is 0-indexed
        limit: this.paginator.pageSize,
        title: this.filterTitle || undefined,
        priority: this.filterPriority || undefined,
        status: this.filterStatus || undefined
      });

      if (response.status && response.data) {
        this.dataSource.data = response.data.items;
        this.totalTasks = response.data.pagination.total;
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
      this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
    } finally {
      this.isLoading = false;
    }
  }

  onSearchChange() {
    // Debounce search input
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.applyFilter();
    }, 500);
  }

  applyFilter() {
    if (this.paginator) {
      this.paginator.firstPage(); // Reset to first page on new filter
    }
    this.loadTasks();
  }

  clearFilters() {
    this.filterTitle = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  openDialog(task?: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task: task }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.loadTasks(); // Refresh table
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

  deleteTask(task: Task) {
    if (!task.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete task "${task.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        try {
          await this.taskService.deleteTask(task.id!);
          this.snackBar.open('Task deleted successfully', 'Close', { 
            duration: 3000, 
            panelClass: ['success-snackbar'] 
          });
          this.loadTasks();
        } catch (error: any) {
          console.error('Failed to delete task', error);
          const errorMsg = error.error?.message || 'Failed to delete task';
          this.snackBar.open(errorMsg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      }
    });
  }

  getPriorityColorHex(priority: string): string {
    return getPriorityColorHex(priority);
  }
}

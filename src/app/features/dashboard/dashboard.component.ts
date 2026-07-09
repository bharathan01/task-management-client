import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = [
    { title: 'Total Tasks', value: 0, icon: 'assignment' },
    { title: 'Backlog Tasks', value: 0, icon: 'inventory_2' },
    { title: 'Planned Tasks', value: 0, icon: 'event' },
    { title: 'In Progress Tasks', value: 0, icon: 'pending' },
    { title: 'Completed Tasks', value: 0, icon: 'check_circle' },
    { title: 'Total Story Points', value: 0, icon: 'assessment' }
  ];

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit() {
    try {
      const response = await this.dashboardService.getSummary();
      if (response.status && response.data) {
        const data = response.data;
        this.stats[0].value = data.totalTasks;
        this.stats[1].value = data.backlogTasks;
        this.stats[2].value = data.plannedTasks;
        this.stats[3].value = data.inProgressTasks;
        this.stats[4].value = data.completedTasks;
        this.stats[5].value = data.totalStoryPoints;
      }
    } catch (error) {
      console.error('Failed to load dashboard summary', error);
    }
  }
}

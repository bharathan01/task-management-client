export interface Task {
  id?: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  plannedDate: string | Date;
  dueDate?: string | Date;
  status: 'Backlog' | 'Planned' | 'In_Progress' | 'Completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedTaskResponse {
  items: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  title?: string;
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../constants/endpoints';
import { ApiResponse } from '../interfaces/auth.interface';
import { Task, PaginatedTaskResponse, TaskQueryParams } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  async getTasks(params?: TaskQueryParams): Promise<ApiResponse<PaginatedTaskResponse>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.priority) httpParams = httpParams.set('priority', params.priority);
      if (params.title) httpParams = httpParams.set('title', params.title);
    }

    return await firstValueFrom(
      this.http.get<ApiResponse<PaginatedTaskResponse>>(`${this.baseUrl}${API.tasks.base}`, { params: httpParams })
    );
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return await firstValueFrom(
      this.http.get<ApiResponse<Task>>(`${this.baseUrl}${API.tasks.byId(id)}`)
    );
  }

  async createTask(task: Task): Promise<ApiResponse<Task>> {
    return await firstValueFrom(
      this.http.post<ApiResponse<Task>>(`${this.baseUrl}${API.tasks.base}`, task)
    );
  }

  async updateTask(id: string, task: Task): Promise<ApiResponse<Task>> {
    return await firstValueFrom(
      this.http.put<ApiResponse<Task>>(`${this.baseUrl}${API.tasks.byId(id)}`, task)
    );
  }

  async patchTaskStatus(id: string, status: string): Promise<ApiResponse<Task>> {
    return await firstValueFrom(
      this.http.patch<ApiResponse<Task>>(`${this.baseUrl}${API.tasks.status(id)}`, { status })
    );
  }

  async deleteTask(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete<any>(`${this.baseUrl}${API.tasks.byId(id)}`)
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interfaces/auth.interface';
import { DashboardSummaryData } from '../interfaces/dashboard.interface';
import { API } from '../constants/endpoints';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  async getSummary(): Promise<ApiResponse<DashboardSummaryData>> {
    return await firstValueFrom(
      this.http.get<ApiResponse<DashboardSummaryData>>(
        `${this.baseUrl}${API.dashboard.summary}`
      )
    );
  }
}

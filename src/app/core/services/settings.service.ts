import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API } from '../constants/endpoints';
import { ApiResponse } from '../interfaces/auth.interface';
import { SettingsData } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  async getSettings(): Promise<ApiResponse<SettingsData>> {
    return await firstValueFrom(
      this.http.get<ApiResponse<SettingsData>>(`${this.baseUrl}${API.settings}`)
    );
  }

  async updateSettings(data: { dailySpLimit: number; weeklySpLimit: number }): Promise<ApiResponse<SettingsData>> {
    return await firstValueFrom(
      this.http.put<ApiResponse<SettingsData>>(`${this.baseUrl}${API.settings}`, data)
    );
  }
}

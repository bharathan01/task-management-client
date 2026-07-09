import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LoginRequest, LoginResponseData } from '../interfaces/auth.interface';
import { API } from '../constants/endpoints';
import { clearAuth, setToken, setUser } from '../helpers/token.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<LoginResponseData>>(
        `${this.baseUrl}${API.auth.login}`,
        credentials
      )
    );

    if (response.status && response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return await firstValueFrom(
      this.http.get<ApiResponse<any>>(`${this.baseUrl}${API.auth.profile}`)
    );
  }

  logout(): void {
    clearAuth();
  }
}

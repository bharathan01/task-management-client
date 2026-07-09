export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: boolean;
  statusCode: number;
  message: string;
  errorType: string;
  timestamp: string;
}

export interface LoginDto {
  userName: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  userId: number;
  roleId: number;
}

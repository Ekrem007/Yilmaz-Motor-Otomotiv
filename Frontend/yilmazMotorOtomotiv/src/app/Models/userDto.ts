export interface UserDto {
  id: number;
  userName: string;
  email: string;
  name: string;
  surName: string;
  address: string;
  phoneNumber: string;
}

export interface UpdateUserDto {
  email: string;
  name: string;
  surName: string;
  phoneNumber: string;
  address: string;
}

export interface User {
  UserId: string;
  name: string;
  firstName: string;
  lastName: string;
  userTypeID?: number; // TODO handle and remove
  role: string;
  email: string;
  phone: string;
  permissions: string;
  isActive: boolean;
  authority: string;
  IsAdmin: boolean;
  //isActive
}

export interface UserLogin {
  username: string;
  password: string;
}

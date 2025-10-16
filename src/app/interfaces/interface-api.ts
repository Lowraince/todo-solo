export interface UserProfile {
  userName: string;
  name: string;
  password: string;
}

export type UserLogin = Omit<UserProfile, 'name'>;

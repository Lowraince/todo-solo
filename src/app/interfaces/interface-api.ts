export interface UserProfile {
  userName: string;
  realNameUser: string;
  password: string;
}

export interface GetUserProfile {
  data: {
    isAdmin: boolean;
    name: string;
    password: string;
    userName: string;
  };
}

export type UserProfileState = GetUserProfile['data'];

export type UserLogin = Omit<UserProfile, 'realNameUser'>;

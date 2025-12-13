export interface GetUserProfile {
  data: {
    isAdmin: boolean;
    name: string;
    password: string;
    userName: string;
  };
}

export type UserProfileState = GetUserProfile['data'];

export type PostCreateUser = Omit<UserProfileState, 'isAdmin'>;

export type postLoginUser = Pick<UserProfileState, 'userName' | 'password'>;

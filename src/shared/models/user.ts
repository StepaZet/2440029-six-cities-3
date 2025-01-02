export enum UserType {
  Common = 'Common',
  Pro = 'Pro'
}


export type User = {
  name: string;
  email: string;
  password: string;
  type: UserType;
  avatarUrl?: string;
}

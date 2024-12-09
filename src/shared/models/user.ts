export enum UserType {
  common = 'Common',
  pro = 'Pro'
}


export type User = {
  name: string;
  email: string;
  password: string;
  type: UserType;
  avatarUrl?: string;
}

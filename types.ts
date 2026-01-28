
export interface UserProfile {
  name: string;
  role: string;
  company: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  instagram: string;
  github: string;
  facebook: string;
  twitter: string;
  avatarUrl: string;
  theme: 'light' | 'dark';
}

export enum AppScreen {
  VIEW = 'VIEW',
  EDIT = 'EDIT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

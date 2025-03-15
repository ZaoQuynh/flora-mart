export interface User {
    id: number | null;
    fullName: string;
    email: string;
    phoneNumber: string;
    username: string;
    tier: string | null;
    points: number | null;
    status: string | null;
    role: string | null;
    tokenRefresh: string | null;
    avatar: string | null;
  }
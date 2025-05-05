export interface NotificationMessage {
    id?: number;
    title: string;
    message: string;
    type: string; // ORDER, PROMOTION, DELIVERY, SYSTEM
    date?: string;
    read?: boolean;
    screen?: string; // Route to navigate to when notification is clicked
    params?: any; // Optional parameters for the route
  }
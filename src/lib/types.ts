export type UserRole = 'customer' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type CuisineType = 'north-indian' | 'south-indian' | 'chettinad' | 'chinese' | 'continental' | 'beverages' | 'snacks';
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'all-day';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages';
  cuisine: CuisineType;
  mealTime: MealTime;
  image: string;
  available: boolean;
  preparationTime: number; // in minutes
  isVeg: boolean;
  isSpicy?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'pending' | 'approved' | 'preparing' | 'ready' | 'completed' | 'rejected';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: number;
  rejectionReason?: string;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'status' | 'info';
  orderId?: string;
  read: boolean;
  createdAt: Date;
}
export type AppState =
  | 'landing'
  | 'owner_login'
  | 'owner_signup'
  | 'setup_step1'
  | 'setup_step2'
  | 'setup_step3'
  | 'client_login'
  | 'client_register'
  | 'client_home'
  | 'client_menu'
  | 'client_tables'
  | 'client_payment'
  | 'client_orders'
  | 'dashboard';

export type DashboardTab =
  | 'dashboard'
  | 'inventory'
  | 'orders'
  | 'menu'
  | 'tables'
  | 'staff'
  | 'branding';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo: string;
  rating: number; // likes
  location: string;
  brandAccentColor?: string;
}

export interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  stock?: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface Table {
  id: string;
  location: string;
  status: 'Free' | 'Occupied';
}

export interface Order {
  id: string;
  tableId: string;
  restaurantId: string;
  restaurantName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Done';
  date: string;
  clientName?: string;
  clientPhone?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Waiter' | 'Chef' | 'Manager';
  phone: string;
  email: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

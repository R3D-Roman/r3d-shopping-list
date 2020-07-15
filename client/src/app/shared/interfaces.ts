export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Todo {
  name?: string;
  cost?: number;
  currency?: string;
  date?: Date;
  completed?: boolean;
  _id?: string;
  state?: string;
}

export interface DeleteMessage {
  message: string;
}

export interface ShoppingCategory {
  value: string;
  viewValue: string;
}

export interface Position {
  name?: string;
  date?: Date;
  cost?: number;
  category?: string;
  completed?: boolean;
  _id?: string;
  state?: string;
  currency?: string;
  todo?: string;
  quantity?: number;
}

export interface ShoppingCurrency {
  value: string;
  viewValue: string;
}
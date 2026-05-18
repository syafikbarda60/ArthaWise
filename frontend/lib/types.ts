export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: TransactionCategory;
  type: "income" | "expense";
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionCategory =
  | "Food & Drink"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Utilities"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  total?: number;
  summary?: TransactionSummary;
  data: T;
}

export interface NewTransactionPayload {
  title: string;
  amount: number;
  category: TransactionCategory;
  type: "income" | "expense";
  date?: string;
}

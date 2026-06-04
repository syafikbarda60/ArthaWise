export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  category: TransactionCategory;
  type: "income" | "expense";
  date: string;
  category_confidence?: number;
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
  category?: TransactionCategory;
  type: "income" | "expense";
  date?: string;
  description?: string;
}

export interface ForecastDataPoint {
  date: string;
  predicted_expense: number;
}

export interface FinancialProfile {
  cluster: string;
  description: string;
  characteristics: string[];
}

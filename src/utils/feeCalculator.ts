// ============================================
// File: lib/utils/feeCalculator.ts
// Fee Calculation Utilities
// ============================================

export const generatePaymentId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `PAY-${timestamp}-${randomStr}`.toUpperCase();
};

export const calculateLateFee = (
  dueDate: Date,
  baseAmount: number,
  penaltyPercentage: number = 2
): number => {
  const today = new Date();
  const daysLate = Math.floor(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLate <= 0) return 0;

  return Math.floor((baseAmount * penaltyPercentage) / 100);
};

export const calculateDiscount = (
  amount: number,
  discountPercentage: number
): number => {
  return Math.floor((amount * discountPercentage) / 100);
};

export const getFeeStatus = (
  totalAmount: number,
  paidAmount: number,
  dueDate: Date
): "pending" | "partial" | "paid" | "overdue" => {
  if (paidAmount >= totalAmount) return "paid";
  if (paidAmount > 0) return "partial";
  if (new Date() > dueDate) return "overdue";
  return "pending";
};

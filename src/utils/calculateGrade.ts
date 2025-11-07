// ============================================
// File: lib/utils/calculateGrade.ts
// Grade Calculation Utilities
// ============================================

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

export const calculateGPA = (percentage: number): number => {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  if (percentage >= 40) return 1.5;
  return 0.0;
};

export const calculatePercentage = (
  obtained: number,
  total: number
): number => {
  if (total === 0) return 0;
  return (obtained / total) * 100;
};

export const isPassingGrade = (grade: string): boolean => {
  return !["F"].includes(grade);
};

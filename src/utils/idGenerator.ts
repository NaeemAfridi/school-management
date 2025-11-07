// ============================================
// File: lib/utils/idgenerator.ts
// Unique ID Generation Utilities
// ============================================

export const generateStudentId = async (count: number): Promise<string> => {
  const year = new Date().getFullYear();
  return `STU-${year}-${String(count + 1).padStart(4, "0")}`;
};

export const generateTeacherId = async (count: number): Promise<string> => {
  const year = new Date().getFullYear();
  return `TCH-${year}-${String(count + 1).padStart(4, "0")}`;
};

export const generateParentId = async (count: number): Promise<string> => {
  const year = new Date().getFullYear();
  return `PAR-${year}-${String(count + 1).padStart(4, "0")}`;
};

export const generateExamId = async (count: number): Promise<string> => {
  const year = new Date().getFullYear();
  return `EXM-${year}-${String(count + 1).padStart(4, "0")}`;
};

export const generateReceiptNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
};

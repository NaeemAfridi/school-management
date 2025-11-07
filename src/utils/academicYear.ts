// ============================================
// File: lib/utils/academicYear.ts
// Academic Year Utilities
// ============================================

export const getCurrentAcademicYear = (): string => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12

  // Academic year starts in April (month 4)
  if (currentMonth >= 4) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
};

export const getAcademicYearsList = (years: number = 5): string[] => {
  const currentYear = new Date().getFullYear();
  const academicYears: string[] = [];

  for (let i = 0; i < years; i++) {
    const year = currentYear - i;
    academicYears.push(`${year}-${year + 1}`);
  }

  return academicYears;
};

export const parseAcademicYear = (
  academicYear: string
): { startYear: number; endYear: number } => {
  const [startYear, endYear] = academicYear.split("-").map(Number);
  return { startYear, endYear };
};

export const isValidAcademicYear = (academicYear: string): boolean => {
  const pattern = /^\d{4}-\d{4}$/;
  if (!pattern.test(academicYear)) return false;

  const { startYear, endYear } = parseAcademicYear(academicYear);
  return endYear === startYear + 1;
};

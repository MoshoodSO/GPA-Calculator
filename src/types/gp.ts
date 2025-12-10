export interface GradeScale {
  grade: string;
  minScore: number;
  maxScore: number;
  points: number;
}

export interface Course {
  id: string;
  name: string;
  creditHours: number;
  score: number;
  grade: string;
  gradePoints: number;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
  gpa: number;
}

export interface ProjectedCourse {
  id: string;
  name: string;
  creditHours: number;
  targetGrade: string;
  currentGrade?: string;
}

export const DEFAULT_GRADING_SCALE: GradeScale[] = [
  { grade: "A", minScore: 70, maxScore: 100, points: 5.0 },
  { grade: "B", minScore: 60, maxScore: 69, points: 4.0 },
  { grade: "C", minScore: 50, maxScore: 59, points: 3.0 },
  { grade: "D", minScore: 45, maxScore: 49, points: 2.0 },
  { grade: "E", minScore: 40, maxScore: 44, points: 1.0 },
  { grade: "F", minScore: 0, maxScore: 39, points: 0.0 },
];

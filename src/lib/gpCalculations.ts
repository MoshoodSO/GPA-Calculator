import { Course, GradeScale, Semester } from "@/types/gp";

export function getGradeFromScore(score: number, scale: GradeScale[]): GradeScale | undefined {
  return scale.find(g => score >= g.minScore && score <= g.maxScore);
}

export function calculateCourseGradePoints(course: Course): number {
  return course.creditHours * course.gradePoints;
}

export function calculateSemesterGPA(courses: Course[]): number {
  if (courses.length === 0) return 0;
  
  const totalCreditHours = courses.reduce((sum, c) => sum + c.creditHours, 0);
  const totalGradePoints = courses.reduce((sum, c) => sum + (c.creditHours * c.gradePoints), 0);
  
  if (totalCreditHours === 0) return 0;
  return totalGradePoints / totalCreditHours;
}

export function calculateCGPA(semesters: Semester[]): number {
  const allCourses = semesters.flatMap(s => s.courses);
  return calculateSemesterGPA(allCourses);
}

export function getAdvice(semesters: Semester[], scale: GradeScale[]): string[] {
  const advice: string[] = [];
  const allCourses = semesters.flatMap(s => s.courses);
  
  if (allCourses.length === 0) {
    return ["Add your courses to get personalized advice!"];
  }
  
  // Find weak courses (below B grade)
  const weakCourses = allCourses.filter(c => c.gradePoints < 4.0);
  const strongCourses = allCourses.filter(c => c.gradePoints >= 4.0);
  
  if (weakCourses.length > 0) {
    const weakestCourses = weakCourses.sort((a, b) => a.gradePoints - b.gradePoints).slice(0, 3);
    advice.push(
      `Focus on improving: ${weakestCourses.map(c => c.name).join(", ")}. Consider extra study sessions or tutoring.`
    );
  }
  
  // GPA trend analysis
  if (semesters.length >= 2) {
    const lastTwo = semesters.slice(-2);
    if (lastTwo[1].gpa > lastTwo[0].gpa) {
      advice.push("Great progress! Your GPA is trending upward. Keep up the momentum!");
    } else if (lastTwo[1].gpa < lastTwo[0].gpa) {
      advice.push("Your GPA dipped this semester. Review your study habits and time management.");
    }
  }
  
  // Credit hour distribution advice
  const avgCredits = allCourses.reduce((sum, c) => sum + c.creditHours, 0) / semesters.length;
  if (avgCredits > 20) {
    advice.push("Consider reducing course load if struggling. Quality over quantity helps GPA.");
  }
  
  // General improvement tips based on current CGPA
  const cgpa = calculateCGPA(semesters);
  if (cgpa < 3.0) {
    advice.push("Prioritize core courses and consider study groups for difficult subjects.");
  } else if (cgpa >= 3.0 && cgpa < 4.0) {
    advice.push("You're doing well! Focus on consistency and aim for A's in your strongest subjects.");
  } else {
    advice.push("Excellent performance! Consider challenging yourself with advanced courses.");
  }
  
  if (strongCourses.length > 0) {
    advice.push(
      `Your strengths: ${strongCourses.slice(0, 3).map(c => c.name).join(", ")}. Leverage these for peer tutoring.`
    );
  }
  
  return advice;
}

export function projectGPA(
  currentSemesters: Semester[],
  targetGPA: number,
  remainingSemesters: number,
  avgCreditsPerSemester: number,
  scale: GradeScale[]
): { achievable: boolean; requiredGPA: number; recommendation: string } {
  const currentCGPA = calculateCGPA(currentSemesters);
  const currentTotalCredits = currentSemesters.flatMap(s => s.courses).reduce((sum, c) => sum + c.creditHours, 0);
  const futureCredits = remainingSemesters * avgCreditsPerSemester;
  const totalCredits = currentTotalCredits + futureCredits;
  
  // Calculate required GPA for remaining semesters
  const requiredGPA = ((targetGPA * totalCredits) - (currentCGPA * currentTotalCredits)) / futureCredits;
  const maxGPA = Math.max(...scale.map(g => g.points));
  
  const achievable = requiredGPA <= maxGPA && requiredGPA > 0;
  
  let recommendation = "";
  if (requiredGPA <= 0) {
    recommendation = "You've already exceeded your target! Aim higher!";
  } else if (requiredGPA <= maxGPA * 0.6) {
    recommendation = `Very achievable! Maintain consistent B grades (${requiredGPA.toFixed(2)} required).`;
  } else if (requiredGPA <= maxGPA * 0.8) {
    recommendation = `Challenging but doable. Aim for mostly A's and B's (${requiredGPA.toFixed(2)} required).`;
  } else if (achievable) {
    recommendation = `Ambitious goal! You'll need nearly all A's (${requiredGPA.toFixed(2)} required).`;
  } else {
    recommendation = `Target may be unrealistic. Consider adjusting to ${(currentCGPA + (maxGPA - currentCGPA) * 0.5).toFixed(2)}.`;
  }
  
  return { achievable, requiredGPA, recommendation };
}

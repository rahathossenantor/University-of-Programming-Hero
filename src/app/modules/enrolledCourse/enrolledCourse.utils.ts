export const calculateGradeAndPoints = (marks: number) => {
    const result: { grade: string, points: number } = {
        grade: "N/A",
        points: 0.00
    };

    if (marks >= 0 && marks <= 20) {
        result.grade = "F";
        result.points = 0.0;
    } else if (marks >= 21 && marks <= 40) {
        result.grade = "D";
        result.points = 2.0;
    } else if (marks >= 41 && marks <= 60) {
        result.grade = "C";
        result.points = 3.0;
    } else if (marks >= 61 && marks <= 80) {
        result.grade = "B";
        result.points = 3.5;
    } else if (marks >= 81 && marks <= 100) {
        result.grade = "A";
        result.points = 4.0;
    } else {
        result.grade = "N/A";
        result.points = 0.0;
    }
    return result;
};

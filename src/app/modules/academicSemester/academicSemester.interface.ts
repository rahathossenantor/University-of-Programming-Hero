export type TMonths =
    "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "Jun"
    | "July"
    | "August"
    | "September"
    | "Octobar"
    | "November"
    | "December";

export type TSemesterNames = "Autumn" | "Summar" | "Fall";
export type TSemesterCodes = "01" | "02" | "03";

export type TAcademicSemester = {
    name: TSemesterNames;
    code: TSemesterCodes;
    year: Date;
    startMonth: TMonths;
    endMonth: TMonths;
};

type TMonths =
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

export type TAcademicSemester = {
    name: "Autumn" | "Summar" | "Fall";
    code: "01" | "02" | "03";
    year: Date;
    startMonth: TMonths;
    endMonth: TMonths;
};

import { TAcademicSemesterNameCodeMapper, TMonths, TSemesterCodes, TSemesterNames } from "./academicSemester.interface";

export const months: TMonths[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octobar",
    "November",
    "December"
];
export const academicSemesterNames: TSemesterNames[] = ["Autumn", "Summer", "Fall"];
export const academicSemesterCodes: TSemesterCodes[] = ["01", "02", "03"];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
    Autumn: "01",
    Summer: "02",
    Fall: "03"
};

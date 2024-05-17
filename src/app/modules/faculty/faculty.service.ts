import QueryBuilder from "../../builder/QueryBuilder";
import { Faculty } from "./faculty.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const getAllFacultiesFromDB = async (query: Record<string, string>) => {
  const facultySearchableFields: string[] = ["name.firstName", "email"];
  const facultyQuery = new QueryBuilder(Faculty.find().populate("academicDepartment"), query)
        .search(facultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .limitFields();
    
  const dbRes = await facultyQuery.modelQuery;
  return dbRes;
};

const getSingleFacultyFromDB = async (id: string) => {
  const dbRes = await Faculty.findById(id).populate("academicDepartment");

  if (!dbRes) {
    throw new AppError(httpStatus.NOT_FOUND, "Faculty does not exist!");
  }
  return dbRes;
};

export const FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB
};

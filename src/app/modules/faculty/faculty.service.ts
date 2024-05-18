import QueryBuilder from "../../builder/QueryBuilder";
import { Faculty } from "./faculty.model";
import { TFaculty } from "./faculty.interface";
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

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const dbRes = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return dbRes;
};

export const FacultyServices = {
    getAllFacultiesFromDB,
    getSingleFacultyFromDB,
    updateFacultyIntoDB
};

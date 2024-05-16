import QueryBuilder from "../../builder/QueryBuilder";

const getAllFacultiesFromDB = (query: Record<string, string>) => {
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

export const FacultyServices = {
    getAllFacultiesFromDB
};

import QueryBuilder from "../../builder/QueryBuilder";
import { Admin } from "./admin.model";

// get all admins
const getAllAdminsFromDB = async (query: Record<string, string>) => {
  const adminSearchableFields: string[] = ["id", "name.firstName", "name.middleName", "name.lastName", "email", "contactNo", "emergencyContactNo"];
  const adminQuery = new QueryBuilder(Admin.find(), query)
        .search(adminSearchableFields)
        .filter()
        .sort()
        .paginate()
        .limitFields();
    
  const dbRes = await adminQuery.modelQuery;
  return dbRes;
};

// get single admin
const getSingleAdminFromDB = async (id: string) => {
  const dbRes = await Admin.findById(id);

  if (!dbRes) {
    throw new AppError(httpStatus.NOT_FOUND, "Admin does not exist!");
  }
  return dbRes;
};

export const AdminServices = {
    getAllAdminsFromDB,
    getSingleAdminFromDB
};

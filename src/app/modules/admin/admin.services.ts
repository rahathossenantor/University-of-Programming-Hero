import QueryBuilder from "../../builder/QueryBuilder";
import { Admin } from "./admin.model";
import { TAdmin } from "./admin.interface";

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

// update admin
const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const dbRes = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return dbRes;
};

export const AdminServices = {
    getAllAdminsFromDB,
    getSingleAdminFromDB,
    updateAdminIntoDB
};

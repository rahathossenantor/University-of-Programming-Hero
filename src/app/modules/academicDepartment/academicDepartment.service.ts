import QueryBuilder from "../../builder/QueryBuilder";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

// create an academic department
const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const dbRes = await AcademicDepartment.create(payload);
    return dbRes;
};

// update academic department
const updateAcademicDepartmentIntoDB = async (
    id: string,
    payload: Partial<TAcademicDepartment>,
) => {
    const dbRes = await AcademicDepartment.findByIdAndUpdate(id, payload, { new: true });
    return dbRes;
};

// get all academic departments
const getAllAcademicDepartmentsFromDB = async (query: Record<string, unknown>) => {
    const academicDepartmentsQuery = new QueryBuilder(
        AcademicDepartment.find().populate("academicFaculty"),
        query
    )
        .filter()
        .sort()
        .paginate()
        .limitFields();
    
    const dbRes = await academicDepartmentsQuery.modelQuery;
    const meta = await academicDepartmentsQuery.countTotal();
    
    return {
        data: dbRes,
        meta
    };
};

// get single academic department
const getSingleAcademicDepartmentFromDB = async (id: string) => {
    const dbRes = await AcademicDepartment.findById(id).populate("academicFaculty");
    return dbRes;
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    updateAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB
};

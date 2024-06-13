import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

// get last student id
const getLastStudentId = async () => {
  const lastStudent = await User
    .findOne({ role: "student" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();
  return lastStudent?.id;
};

// generate student id
export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = "0000";
  const lastStudentId = await getLastStudentId();
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  if (
    lastStudentId &&
    lastStudentSemesterYear === payload.year &&
    lastStudentSemesterCode === payload.code
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

// get last faculty id
export const getLastFacultyId = async () => {
  const lastFaculty = await User
    .findOne({ role: "faculty" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id;
};

// generate faculty id
export const generateFacultyId = async () => {
  let currentId = "0000";
  const lastFacultyId = await getLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `F-${incrementId}`;
  return incrementId;
};

// get last admin id
export const getLastAdminId = async () => {
  const lastAdmin = await User
    .findOne({ role: "admin" }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id;
};

// generate admin id
export const generateAdminId = async () => {
  let currentId = "0000";
  const lastAdminId = await getLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");
  incrementId = `A-${incrementId}`;
  return incrementId;
};

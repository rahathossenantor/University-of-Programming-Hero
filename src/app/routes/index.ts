import { Router } from "express";
import { StudentRoutes } from "../modules/student/student.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { FacultyRoutes } from "../modules/faculty/faculty.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.routes";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.routes";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicFaculty.routes";
import { CourseRoutes } from "../modules/course/course.routes";

const router = Router();

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes
    },
    {
        path: "/admins",
        route: AdminRoutes
    },
    {
        path: "/faculties",
        route: FacultyRoutes
    },
    {
        path: "/students",
        route: StudentRoutes
    },
    {
        path: "/courses",
        route: CourseRoutes
    },
    {
        path: "/academic-semesters",
        route: AcademicSemesterRoutes
    },
    {
        path: "/academic-faculties",
        route: AcademicFacultyRoutes
    },
    {
        path: "/academic-departments",
        route: AcademicDepartmentRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;

import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student/student.routes";
import { UserRoutes } from "./app/modules/user/user.routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/students", StudentRoutes);
app.use("/api/v1/users", UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to The University of Programming Hero");
});

// global error handler
app.use(globalErrorHandler);

export default app;

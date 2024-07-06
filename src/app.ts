import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// parsers (middlewares)
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["*"] }));

// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to The University of Programming Hero");
});

// global error handler
app.use(globalErrorHandler);
// not found route
app.use(notFound);

export default app;

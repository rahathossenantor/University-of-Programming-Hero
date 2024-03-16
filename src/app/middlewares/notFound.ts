import { Request, Response } from "express";
import httpStatus from "http-status";

const notFound = (req: Request, res: Response) => {
    return res.status(httpStatus.NOT_FOUND).json({
        succses: false,
        message: "API not found!",
        error: null
    });
};

export default notFound;

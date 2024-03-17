import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (controllerFn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(controllerFn(req, res, next)).catch(err => next(err));
    };
};

export default catchAsync;

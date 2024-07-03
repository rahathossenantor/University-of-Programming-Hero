import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
    console.log(payload);
    return payload;
};

export const AuthServices = {
    loginUser
};

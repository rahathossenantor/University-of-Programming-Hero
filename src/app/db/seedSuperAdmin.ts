import config from "../config";
import { User } from "../modules/user/user.model";

const superAdmin = {
    id: "0001",
    email: "dev.rahathossen@gmail.com",
    password: config.default_pass,
    needsPasswordChange: false,
    role: "super-admin",
    status: "in-progress"
};

const seedSuperAdmin = async () => {
    const isSuperAdminExist = await User.findOne({
        role: "super-admin"
    });
    if (!isSuperAdminExist) {
        await User.create(superAdmin);
    }
};

export default seedSuperAdmin;

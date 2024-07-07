import { Schema } from "mongoose";
import { TName } from "../interface/global.interface";

export const nameSchema = new Schema<TName>({
    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (fName: string) => {
                const splittedName = fName.trim().split(" ");
                const capitalizedName = splittedName.map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()));
                const userName = capitalizedName.join(" ");
                return userName === fName;
            },
            message: props => `${props.value} is not a valid format!`
        }
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (lName: string) => {
                const splittedName = lName.trim().split(" ");
                const capitalizedName = splittedName.map(word => (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()));
                const userName = capitalizedName.join(" ");
                return userName === lName;
            },
            message: props => `${props.value} is not a valid format!`
        }
    }
}, {
    _id: false
});

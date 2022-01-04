import { Schema } from 'mongoose';
import { User } from '@models/user';

const UserSchema = new Schema<User>({

    // TODO - base these parameters off User model
    id: {type: Number, required: true, unique: true},
    email:{type: String, required: true, unique: true},
    name: {type: String, required: true},
    phoneNumbers: [{type: String, required: true}]

});



export default UserSchema;

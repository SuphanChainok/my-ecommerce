import { Schema, model, models, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
    label: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    wishlist: Types.ObjectId[];
    addresses: IAddress[];
    comparePassword(candidate: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>({
    label:       { type: String, required: true },
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    addressLine: { type: String, required: true },
    city:        { type: String, required: true },
    postalCode:  { type: String, required: true },
    isDefault:   { type: Boolean, default: false },
});

const UserSchema = new Schema<IUser>(
    {
        name:     { type: String, required: true },
        email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role:     { type: String, enum: ['user', 'admin'], default: 'user' },
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        addresses: [AddressSchema],
    },
    { timestamps: true }
);

UserSchema.pre('save', async function () {
    const user = this as unknown as IUser;
    if (!user.isModified('password')) return;
    user.password = await bcrypt.hash(user.password, 12);
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
};

const User = models.User ?? model<IUser>('User', UserSchema);

export default User;

import { Schema, model, models, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    phone: string;
    shippingAddress: IShippingAddress;
    wishlist: Types.ObjectId[];
    comparePassword(candidate: string): Promise<boolean>;
}

const ShippingAddressSchema = new Schema<IShippingAddress>({
    fullName:    { type: String, default: '' },
    phone:       { type: String, default: '' },
    address:     { type: String, default: '' },
    subdistrict: { type: String, default: '' },
    district:    { type: String, default: '' },
    province:    { type: String, default: '' },
    postalCode:  { type: String, default: '' },
}, { _id: false });

const UserSchema = new Schema<IUser>(
    {
        name:            { type: String, required: true },
        email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
        password:        { type: String, required: true },
        role:            { type: String, enum: ['user', 'admin'], default: 'user' },
        phone:           { type: String, default: '' },
        shippingAddress: { type: ShippingAddressSchema, default: {} },
        wishlist:        [{ type: Schema.Types.ObjectId, ref: 'Product' }],
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

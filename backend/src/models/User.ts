import { Schema, model, Document } from 'mongoose';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CITY_ADMIN'
  | 'TRAFFIC_OPERATOR'
  | 'EMERGENCY_OPERATOR'
  | 'ANALYST'
  | 'VIEWER';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'CITY_ADMIN', 'TRAFFIC_OPERATOR', 'EMERGENCY_OPERATOR', 'ANALYST', 'VIEWER'],
      default: 'TRAFFIC_OPERATOR',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UserModel = model<IUser>('User', UserSchema);

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  email: string
  name?: string
  role?: string
  passwordHash: string
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  role: { type: String, default: 'user' },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema)



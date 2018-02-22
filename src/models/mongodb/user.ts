import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  name: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const schema = new mongoose.Schema(
  {
    name: String,
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.pre("save", function(this: IUser, next) {
  const user: IUser = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

schema.pre("update", function(this: IUser, next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    this.password = hash;
    next();
  });
});

schema.methods.comparePassword = function(this:IUser,
  candidatePassword: string
): Promise<boolean> {
  let password = this.password;
  return new Promise((resolve: any, reject: any) => {
    bcrypt.compare(candidatePassword, password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

export const model = mongoose.model<IUser>("User", schema);

export const cleanCollection = () => model.remove({}).exec();

export default model;

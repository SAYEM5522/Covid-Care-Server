import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";
import JoiPasswordComplexity from "joi-password-complexity"
const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true,unique:true },
	password: { type: String, required: true },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "secreat123", {
		expiresIn: "7d",
	});
	return token;
}
const User = mongoose.model("user", userSchema);
const complexityOptions = {
  min: 7,
  max: 18,
};
const validate = (data) => {
	const schema = Joi.object({
	  name: Joi.string().required().label("Name"),
		email: Joi.string().email().required().label("Email"),
		password:JoiPasswordComplexity(complexityOptions).required().label("Password"),
	});
	return schema.validate(data);
};
export { User, validate };



import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose  from "mongoose";
import { User, validate } from "./User.js";
import bcrypt from "bcrypt";
import Joi from "joi";
const app=express();
app.use(bodyParser.json());
app.use(cors());
const validate2 = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};
const Port=process.env.PORT || 5001;
const connection__Url="mongodb+srv://covid-care:sayembd5522@cluster0.dn7fy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
app.get("/",(req,res)=>{
    res.send("Hello World");
})
mongoose.connect(connection__Url,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
  console.log(err||"Connected to the database");
});
app.post("/auth",async(req,res)=>{
  try {
		const { error } = validate2(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });
		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})
app.post("/user",async (req,res)=>{
  try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(10));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		await new User({ ...req.body, password: hashPassword }).save();
    const {name,email}=req.body;
		res.status(201).send({name:name,email:email ,message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})
app.get("/userDetails",(req,res)=>{

})
app.listen(Port,()=>{
  console.log("server started at port 5001");
})
const userModel = require('../models/userModel');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



module.exports = {
    signup: async (req, res) => {
        try {
            const user = await userModel.findOne(req.body);
            if(!user) {
                return res.status(200).send({ message: "Signup success" });
            }
            else {
                return res.status(200).send({ message: "This email address has already been existed" });
            }
        }
        catch(err) { 
            console.error(err);
        }
    },

    register: async (req, res) => {
        try {
            const { email, password, phone, name } = req.body;
            const userFound = await userModel.findOne({ email: email });
            if(userFound) {
                return res.status(200).send({ token: userFound.token });
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const user = await userModel.create(Object.assign({ email: email, password: hash, phone: phone, name: name }));
            const token = jwt.sign({ email: user.email, _id: user._id }, process.env.REFRESH_TOKEN_SECRET);
            user.token = token;
            user.save();
            console.log(res.json(user));
            res.cookie("token", token, { maxAge: 3600000, httpOnly: true, secure: true, sameSite: "none" });
            return res.status(200).send({ token: token });
        }
        catch(err) {
            console.error(err);
        }
    },

    login: async (req, res) => {
        try {
            const { email, password, rememberMe } = req.body;
            const user = email.indexOf('@') === -1 ? await userModel.findOne({ phone: email }) : await userModel.findOne({ email: email });
            if(user) {
                if(bcrypt.compareSync(password, user.password)) {
                    console.log(rememberMe);
                    if(rememberMe) res.cookie("token", user.token, { maxAge: 86400000, httpOnly: true, secure: true });
                    else res.cookie("token", user.token, { maxAge: 3600000, httpOnly: true, secure: true, sameSite: "none" });
                    return res.status(200).send({ message: "Login success", token: user.token, sameSite: "none" });
                }
                return res.status(200).send({ message: "The password is incorrect" });
            }
            return res.status(200).send({ message: "Email or phone number not found" });
        }
        catch(err) {
            console.log(err);
        }
    },

    logout: async (req, res) => {
        try {
            res.cookie("token", "", { maxAge: 5000 });
        }
        catch(err) {
            console.log(err);
        }
    },

    getList: async (req, res) => {
        try {
            const token = req.cookies.token;
            if(!token)  return res.status(200).send({ message: "Unauthorized" });
            const user = await userModel.findOne({ token: token });
            if(user)
                return res.status(200).send({ message: "Logged in", list: user.list });
        }
        catch(err) {
            console.log(err);
        }
    },

    updateList: async(req, res) => {
        try {
            const { type, feature } = req.body;
            const token = req.cookies.token;
            const user = await userModel.findOne({ token });
            if(user) {
                const movieFound = user.list.find(movie => movie.type === type && movie.feature.id === feature.id);
                if(movieFound) {
                    user.list = user.list.filter(movie => movie.type !== type || movie.feature.id !== feature.id);
                    res.status(200).send({ in_list: false });
                    console.log("Removed");
                }
                else {
                    user.list.push({ type: type, feature: feature });
                    res.status(200).send({ in_list: true });
                    console.log("Added");
                }
                user.save();
            }
        }
        catch(err) {
            console.error(err);
        }
    },

    check: async (req, res) => {
        try {
            const { type, id } = req.params;
            const token = req.cookies.token;
            if(!token)  return res.status(200).send({ message: "Unauthorized" });
            const user = await userModel.findOne({ token });
            if(user) {
                const movieFound = user.list.find(movie => movie.type === type && movie.feature.id == id);
                if(movieFound) {
                    return res.status(200).send({ message: "Logged in", in_list: true });
                }
                return res.status(200).send({ message: "Logged in", in_list: false });
            }
        }
        catch(err) {
            console.error(err);
        }
    },

    getRecently: async (req, res) => {
        try {
            const token = req.cookies.token;
            if(!token)  return res.status(200).send({ message: "Unauthorized" });
            const user = await userModel.findOne({ token: token });
            if(user)
                return res.status(200).send({ message: "Logged in", recently: user.recently });
        }
        catch(err) {
            console.log(err);
        }
    },

    updateRecently: async (req, res) => {
        try {
            const { type, feature } = req.body;
            const token = req.cookies.token;
            const user = await userModel.findOne({ token });
            if(user) {
                user.recently = user.recently.filter(movie => movie.type !== type || movie.feature.id !== feature.id);
                user.recently.unshift({ type: type, feature: feature });
                if(user.recently.length > 20) user.recently.pop();
                user.save();
            }
        }
        catch(err) {
            console.error(err);
        }
    }
};
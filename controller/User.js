const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { spawn } = require('child_process');
var path = require('path');

const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const getUser = async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('movie-project');
        const users = db.collection('users');
        const returnedUsers = await users.find().toArray();
        res.send(returnedUsers)
    }
    finally {
        client.close();
    }
}
const getDetailUser = async (req, res) => {
    const client = new MongoClient(uri);
    const userId = req.query.userId;
    try {
            await client.connect();
            const db = client.db('movie-project');
            const users = db.collection('users'); 
            const query = {user_id: userId}
            const user = await users.findOne(query);
            res.send(user);

    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }
}
const updateUser = async ( req, res) => {
    const client = new MongoClient(uri);
    const formData = req.body.formData;
    console.log(formData)
    try {
        await client.connect();
        const database = client.db('movie-project');
        const users = database.collection ('users');
        const query = {user_id: formData.user_id};
        const updateUserDocument = {
            $set: {
                name: formData.name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                gender: formData.gender,
                about: formData.about,
                photo: formData.photo
            },
        }
        const updatedUser = await users.updateOne(query, updateUserDocument);
        res.send(updatedUser);
    } catch (error) {
        console.log(error)
    } finally {
        await client.close();
    }
}
const loginUser = async (req, res) => {
    const client = new MongoClient(uri);
    const {email, password} = req.body;
    console.log(req.body);
    try {
        await client.connect();
        const db = client.db('movie-project');
        const users = db.collection('users');
        const user = await users.findOne({email});
        
        if(user){
            const correctPassword = await bcrypt.compare(password, user.hashed_password)
            if(correctPassword) {
                const token = jwt.sign(user, 'jwtLogin', {
                    expiresIn: 60 * 24,
                })
                res.status(201).json({token, userId: user.user_id})
            } 
        }
        res.status(400).send("Incorrect username or password");
    } catch (error) {
        console.log(error);
    }
};
const signUpUser = async (req, res) => {

    const client = new MongoClient(uri);
    const { email, password } = req.body;
    console.log(email, password);

    const generateUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await client.connect();
        const db = client.db('movie-project');
        const users = db.collection('users');
        const existingUser = await users.findOne({email});
        if(existingUser) {
            return res.status(409).send("Username has existed");
        }
        const sanitizedEmail = email.toLowerCase();

        const data = {
            user_id: generateUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword,
        }
        const insertedUser = await users.insertOne(data);

        const token = jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        })
        res.status(201).json({token, userId: generateUserId})

    } catch (err){
        console.log(err)
    }
}
const getSimilar =  async (req, res) => {
    const { detailId } = req.body;
    console.log(detailId);
    if(detailId){
        console.log("python running");
        const pyprog = await spawn('python', ['./controller/recommend.py', `${detailId}`]);
        pyprog.on('exit', async () => {
            await res.sendFile(path.join(__dirname, 'movies.json'));
            console.log("done");
        });
    }
}
const getTopRated = async (req, res) => {
    await res.sendFile(path.join(__dirname, 'popular.json'));
}
module.exports = { getUser, getDetailUser, updateUser, loginUser, signUpUser, getSimilar, getTopRated};

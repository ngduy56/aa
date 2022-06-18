const PORT = process.env.PORT || 8000;

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { spawn } = require('child_process');
var path = require('path');

const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

const app = express();
app.use(express.json());
app.use(cors());

const router = require('./routes');
app.use(router);

// app.post('/similar', async (req, res) => {
//     const { detailId } = req.body;
//     console.log(detailId);
//     if(detailId){
//         console.log("python running");
//         const pyprog = await spawn('python', ['recommend.py', `${detailId}`]);
//         pyprog.on('exit', async () => {
//             await res.sendFile(path.join(__dirname, 'movies.json'));
//             console.log("done");
//         });
//     }
// })
// /////////////////////////////////////////////////////
// app.post('/signup', async (req, res) => {
    
//     const client = new MongoClient(uri);
//     const { email, password } = req.body;
//     console.log(email, password);

//     const generateUserId = uuidv4();
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log(hashedPassword);
//     try {
//         await client.connect();
//         const db = client.db('movie-project');
//         const users = db.collection('users');
//         const existingUser = await users.findOne({email});
//         if(existingUser) {
//             return res.status(409).send("user has existed")
//         }
//         const sanitizedEmail = email.toLowerCase();

//         const data = {
//             user_id: generateUserId,
//             email: sanitizedEmail,
//             hashed_password: hashedPassword,
//         }
//         const insertedUser = await users.insertOne(data);

//         const token = jwt.sign(insertedUser, sanitizedEmail, {
//             expiresIn: 60 * 24,
//         })
//         res.status(201).json({token, userId: generateUserId})

//     } catch (err){
//         console.log(err)
//     }
// })
// app.post('/login',  async (req, res) => {
//     const client = new MongoClient(uri);

//     const {email, password} = req.body;
//     try {
//         await client.connect();
//         const db = client.db('movie-project');
//         const users = db.collection('users');

//         const user = await users.findOne({email});
//         const correctPassword = await bcrypt.compare(password, user.hashed_password)

//         if(user && correctPassword){
//             const token = jwt.sign(user, 'jwtLogin', {
//                 expiresIn: 60 * 24,
//             })
//             res.status(201).json({token, userId: user.user_id})
//         }
//         res.status(400).send("Invalid");
//     } catch (error) {
//         console.log(error)
//     }
// });
// app.put('/user', async ( req, res) => {
//     const client = new MongoClient(uri);
//     const formData = req.body.formData;
//     console.log(formData)
//     try {
//         await client.connect();
//         const database = client.db('movie-project');
//         const users = database.collection ('users');
//         const query = {user_id: formData.user_id};
//         const updateUserDocument = {
//             $set: {
//                 name: formData.name,
//                 dob_day: formData.dob_day,
//                 dob_month: formData.dob_month,
//                 dob_year: formData.dob_year,
//                 gender: formData.gender,
//                 about: formData.about,
//                 photo: formData.photo
//             },
//         }
//         const updatedUser = await users.updateOne(query, updateUserDocument);
//         res.send(updatedUser);
//     } catch (error) {
//         console.log(error)
//     } finally {
//         await client.close();
//     }
// })
// app.get('/user', async (req, res) => {
//     const client = new MongoClient(uri);
//     const userId = req.query.userId;
//     try {
//             await client.connect();
//             const db = client.db('movie-project');
//             const users = db.collection('users'); 
//             const query = {user_id: userId}
//             const user = await users.findOne(query);
//             res.send(user);

//     } catch (error) {
//         console.log(error)
//     } finally {
//         await client.close();
//     }
// })

// app.get('/', async (req, res) => {
//     const client = new MongoClient(uri);
//     try {
//         await client.connect();
//         const db = client.db('movie-project');
//         const users = db.collection('users');
//         const returnedUsers = await users.find().toArray();
//         res.send(returnedUsers)
//     }
//     finally {
//         client.close();
//     }
// })

app.listen(PORT, () => console.log("server running on " + PORT));
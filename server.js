import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path"

const app = express();

import { v2 as cloudinary } from 'cloudinary';
import { url } from "inspector";

cloudinary.config({
    cloud_name: 'dxv6l1gky',
    api_key: '472266133744618',
    api_secret: 'ClTWSDkA4NYME_DJVZCq8myhra4'
});

mongoose
    .connect(
        "mongodb+srv://codesnippet02:nq0sdJL2Jc3QqZba@cluster0.zmf40.mongodb.net/",
        {
            dbName: "NodeJs_Mastery_Course",
        }
    )
    .then(() => console.log("MongoDb Connected..!"))
    .catch((err) => console.log(err));



// rendering ejs file
app.get('/', (req, res) => {
    res.render("index.ejs", { url: null })
})

const storage = multer.diskStorage({
//   destination: './public/uploads',
   function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


const imageSchema = new mongoose.Schema({
    filename : String,
    public_id : String,
    imgURL : String


});

const File = mongoose.model ("cloudinary", imageSchema)

app.post('/upload', upload.single('file'), async (req, res) =>{

const file = req.file.path

const cloudinaryRes = await cloudinary .uploader.upload(file,{

    folder:"Image-Uploader Project"
})

// saved to database

const db = await File.create({
    filename :file.originalname,
    public_id : cloudinaryRes.public_id,
    imgUrl : cloudinaryRes.secure_url


});

res.render ("index.ejs" ,{url:cloudinaryRes.secure_url});

// res.json ({message: 'File Uploaded Sucessfully', cloudinaryRes});


  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

const port = 1000;
app.listen(port, () => console.log(`server is running on port ${port}`));
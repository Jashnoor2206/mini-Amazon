const multer = require('multer');
const path = require('path')

const Max_photo_size = 2*1024*1024 ; // max 2 mb is allowed
const allowed = { // maps each allowed type to its file extension
    'image/jpeg' : '.jpg', 
    'image/png' : '.png', 
    'image/webp' : '.webp'
};

// now first we will see what is a storage and why do we need it ?
// In a storage we store our photos locally , for example server runs in this mac so it is stored locally here . Now you may ask why not store the photo in mongoDB because , photos are large and when you store the photo in mongoDB, now each request gets heavier . When you request user from server it may take time . Also mongoDB has hard limit of about 16mb , no document can exeed it . And photos themselves take few mb , hence we store each photo locally and we store the address in mongoDB as a string 

// .diskStorage is the funciton multer gives you , you pass it an object with two answers folder and a file name and it gives back a 'storage plan' , nothing is saved . It's just a plan multer will follow when photo arrives .
//  Now destination : which folder . __dirname = folder this file is in '../public/uploads/profile' means then go up one level ie mini-amazon then go to public/uploads/profile and here is the file 
// Now filename : what to call a file , req contains the user . file : details of the photo eg file.mimetype = 'image/jpeg'. cb is a callback function you give multer your answer 
// example you logged in with id 667av and you upload myphoto.jpg and time is 17291919 , name of the photo becomes 667av-17291919.jpg and multer saves photo in our path and puts req.file.filename = '667av-17291919.jpg' which your controller turns into path saved in mongodb
const storage = multer.diskStorage({
    destination : path.join(__dirname, '../public/uploads/profile'),
    filename : (req, file , cb) => {
        cb(null , `${req.user._id}-${Date.now()}${allowed[file.mimetype]}`);
    }
});

// multer({ ... }) this creates your multer uploader in one place with all the rules like where to save , how big is the file what type . like storage nothing runs yet its a configured tool and route will use later . storage stores the upload according to plan we made above, limits are self explanatory . filefilter is a security guard at the door to check the specifications of the file . here cb answers a yes/no question . cb(null, true) means no error let it run away else error is specified 
const upload = multer({
    storage,
    limits: { fileSize: Max_photo_size },
    fileFilter: (req, file, cb) => {
        if(allowed[file.mimetype]) return cb(null, true);
        cb(new Error('Only JPG, PNG or WEBP images are allowed'));
    }
});

// now what is this ? it a normal express middleware exactly like your requireLoginApi. In route it sits in middleware router.patch('/profile', requireLoginApi, uploadProfilePhoto, updateProfile);
// upload.single means that expect one file in the form field named profilePhoto
// upload.single('profilePhoto') works like makeGreeter('Hi'). It doesn't upload anything , it makes a function named (req, res, next)
function uploadProfilePhoto(req, res, next){
    upload.single('profilePhoto')(req, res, (err) => {
        if(err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({ error: 'Photo must be 2 MB or smaller' });
        }
        if(err) return res.status(400).json({ error: err.message });
        next();
    });
}

// lets understand some syntax first : 
// we know that normal function returns a value , but a function can also return another function like for eg 
// function makeGreeter(greeting){
//     return function(name){
//         console.log(greeting + ',' + name);
//     }
// }
// now if we write 
// const sayHi = makeGreeter('Kive aa ');
// // sayHi is a function nothing is printed yet 
// sayHi('Arnav');   now it will print 'Kive aa, Arnav'

// and for the same function you can also write makeGreeter('Hi')('Arnav') it will work in same manner 


module.exports = {uploadProfilePhoto};
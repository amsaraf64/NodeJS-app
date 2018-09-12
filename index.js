var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname + '/public')); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

//Session to store user data between HTTP requests
app.use(session({
    cookieName: 'session',
    secret: 'code',
    resave: false,
    saveUninitialized: true
  }));

//Only admin User is authenticated
var Users = [{
    "username" : "admin",
    "password" : "admin"
}];
//Array of students to be listed
var students = []

//route for root 
app.get('/',function(req,res){
    //check if user session exits
    if(req.session.user){
        res.redirect('/create');
    }else
    {
        res.render('login');
        console.log("Render login page");
    }
});

//route for handling post request for login
app.post('/login',function(req,res){
    if(req.session.user){
        res.render('/create');
    }else{
        console.log("Inside Login Post Request");
        console.log("Req Body : ", req.body);
        Users.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password)
            {   
                //setting cookie
                req.session.user = user;
                res.redirect('/create');
                console.log("Redirecting to create page");
            }
            else
            {
                console.log("Wrong credentials entered");
            }
        })
    }
    
});

//route for handling get request for create
app.post('/create',function(req,res){
    if(!req.session.user){
        res.redirect('/');
        console.log("Redirecting to login");
    }else{
        var newStudent = {Name: req.body.Name, StudentID : req.body.StudentID , Department : req.body.Department};
        var exists;

        for(let i=0 ; i < students.length; i++)
        {  
            if(students[i].StudentID === newStudent.StudentID)
            {
                exists = true;
                break;
            }
            else
            {
                exists = false;
            }
        }

        if(exists == true)
        {
            console.log("Student with name " + newStudent.Name + " could not be created")
            console.log("Another student with ID " + newStudent.StudentID + " already exists");
            res.redirect('/create');
        }
        else
        {
            students.push(newStudent);
            console.log(newStudent.Name + " is added to the list of students");
            res.redirect('/home');
        }

       
     
    }
    
});

//route to handle get request for home
app.get('/home',function(req,res){
    if(!req.session.user){
        res.redirect('/');
        console.log("Redirecting to login");
    }else{
        console.log("Session data : " , req.session);
        res.render('home',{
            students : students
        });
    }
    
    
});

//route to handle get request for create
app.get('/create',function(req,res){
    if(!req.session.user){
        console.log("Redirecting to login page");
        res.redirect('/');
    }else{
        res.render('create');
        console.log('Render create view');
    }
    
});

/* //route to handle get request for delete
 app.get('/delete',function(req,res){
    console.log("Session Data : ", req.session.user);
    if(!req.session.user){
        console.log("Invalid request to delete. Redirecting to login")
        res.redirect('/');
    }else
    {
        res.render('home');
        console.log("Rendering home view");
    }
}); 
 */
//route to handle get request for deleting a student from list of students
app.get('/delete/:StudentID', function(req,res)
{
    if (req.session.user)
    {
        var index  = students.map(function(student) 
        { return student.StudentID; 
        }).indexOf(req.params.StudentID);

         if(index === -1){
            console.log("Student not found");
         } else {
            students.splice(index, 1);
            console.log("Student with ID : " + req.params.StudentID + " was removed successfully");
            res.redirect('/home');
         }
        
    }
    else{
        console.log("Invalid access to delete. Redirecting to login")
        res.redirect('/');
    }
});

//Listens for connections on specified port
var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
 
});
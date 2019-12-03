const morgan = require('morgan');
const express = require('express');
const mysql = require('mysql');
const hbs = require('express-handlebars');
const config = require('./config');
const mkQuery = require('./dbutil');
const jwt = require('jsonwebtoken');
const currTime = (new Date()).getTime();

const PORT = 3000;

// sql 
const pool = mysql.createPool(config);

const FIND_USER = 'select count(*) as user_count from users where username = ? and password = sha2(?, 256)';
const findUser = mkQuery(FIND_USER, pool);
const authenticateUser = (param) => {
    return (
        findUser(param)
            .then(result => (result.length && result[0].user_count > 0)) //returns true or false
    )
};

const GET_USER_DETAILS = 'select username, email, department from users where username = ?';
const getUserDetails = mkQuery(GET_USER_DETAILS, pool);

const GET_ALL_CUSTOMERS = 'select * from users';
const getAllCustomers = mkQuery(GET_ALL_CUSTOMERS, pool);



// load passport and passport local
const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;

// you can do passport.use for many strategies
passport.use(new LocalStrategy(
    {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    },
    (req, user, pass, done) => {
        //perform authentication
        authenticateUser([user, pass])
        .then(result =>{
            console.log('authenticate result: ', result);
            req.authenticated = result;
            if (result){
                req.loginAt = new Date(); // since we have the req object, we can put in any kind of data we want
                return done(null, user); // 1st param is always null (not sure why but just take it as it is), 2nd is user
            }
            return done(null, false);
        })
        .catch(err=>{
            console.error('authenication db error: ', err);
            return done(null, false);
        })
    })
);

// serialize user
// save the user to the session -> create session_id cookie
// this will save the user to session
passport.serializeUser(
    (user, done) =>{
        console.log('**Serialize user: ', user);
        done(null, user);
    }
);

// deserialize user
// retrieve the user profile from the database and pass it to passport
// passport will attach the user details to req.user (if it has req.user, means it is authenticated.)
passport.deserializeUser(
    (user, done) =>{
        console.log('**Deserialize user: ', user);
        getUserDetails([user])
        .then(result=>{
            console.log('>>> result from deserialize: ', {...result[0]});
            if (result.length){
                return done(null, {...result[0]}); //turn it into a regular json object (if you don't want row data packet)
            }
            done(null, user);
        })
    }
);

const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main.hbs'}))
app.set('view engine', 'hbs');

app.use(morgan('tiny'));

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.get([ '/', '/login' ], (req, resp) => {
    console.log('>>user:', req.user);
    resp.status(200).type('text/html').render('index');
});

app.get('/status/:code', (req, resp) =>{
    //need to do more checking
    resp.status(parseInt(req.params.code,10).json({message: 'incorrect login'}));
})

app.get('/customers', 
    (req,resp,next)=>{
        const authorization = req.get('Authorization'); // get the header
        //if cannot get the header, return 403
        if (!authorization){
            resp.status(403).json({message: 'not authorized'});
        }
        // if Authroization is NOT in this format: Authorization: BearereyJhbGciOiJ...SsxY, return 403
        if (!authorization.startsWith('Bearer ')){
            resp.status(403).json({message: 'not authorized'});
        }
        const tokenStr = authorization.substring('Bearer '.length);
        try{
            req.jwt = jwt.verify(tokenStr, config.tokenSecret);
            next();
        }
        catch (e){
            return resp.status(401).json({message: 'invalid token'});
        }
    },
    (req, resp)=>{
        console.log('token:', req.jwt);
        getAllCustomers()
        .then(result=>{
            resp.status(200).json(result);
    })
})
app.post(
    '/authenticate', 
    passport.authenticate('local', {
        // successRedirect: '/success.html',
        failureRedirect: '/status/401',
        session: false
    })
    , 
    (req, resp) =>{
        console.log("user=", req.user);
        getUserDetails([req.user])
        .then (result=>{
            //issue the JWT token
            const token=  jwt.sign({
                sub: req.user,
                iss: 'snmf-day32-token',
                iat: currTime / 1000,
                exp: currTime/1000 + (30),
                data: 
                    { 
                        email: req.email,
                        department: req.department
                    }
            },config.tokenSecret);
            return resp.status(200).json({token_type: 'Bearer', access_token: token});
        })
        
    }
)

app.use(express.static(__dirname + '/public'))

app.listen(PORT,
    () => { console.info(`Application started on port ${PORT} at ${new Date()}`) }
);

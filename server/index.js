'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB
const cors = require('cors');

/*** Set up Passport ***/
// funzione che verifica username e password
passport.use(new LocalStrategy(
    function(username, password, done) {
      userDao.getUser(username, password).then((user) => {
        if (!user)
          return done(null, false, { message: 'Incorrect username and/or password.' });
          
        return done(null, user);
      })
    }
  ));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.matricola);
  });
  
// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
      .then(user => {
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  });

  // init express
const app = express();
const port = 3008;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions)); 

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
      return next();
    
    return res.status(401).json({ error: 'not authenticated'});
  }

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false 
  }));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

/*** APIs ***/

// GET /api/corsi
app.get('/api/corsi', async (req, res) => {
  try {
    const corsi = await dao.listCourses();
    
    for (const corso of corsi){
      corso.incomp = await dao.listIncompatibility(corso.codice);
      corso.prop = await dao.getACourse(corso.propedeuticita);
    
    }

   
    return res.status(200).json(corsi)
  } catch(e) {
   console.log(e)
    res.status(500).json({ error: `Database error while retrieving course .`}).end();
  }
  });
  

  // GET /api/corsi
app.get('/api/corsi/:id', async (req, res) => {
  try {
    const corso = await dao.getACourse();
    return res.status(200).json(corso)
  } catch(e) {
   console.log(e)
    res.status(500).json({ error: `Database error while retrieving course .`}).end();
  }
  });

// GET /api/incompatibilita
app.get('/api/incompatibilita/:codiceCorso', async (req, res) => {
    try {
      const result = await dao.listIncompatibility(req.params.codiceCorso);
      if(result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: `Database error while retrieving course ${req.params.codiceCorso}.`}).end();
    }
  });

  // GET /api/pianodistudi
app.get('/api/pianodistudi',isLoggedIn, async (req, res) => {
    try {
      const result = await dao.listStudyPlan(req.user.matricola);
      if(result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: `Database error while retrieving StudyPlan.`}).end();
    }
  });

    // GET /api/creditistudente
app.get('/api/creditistudente', isLoggedIn, async (req, res) => {
    try {
      const result = await dao.creditsStudent(req.user.matricola);
      if(result==0)
        res.status(404).json(result);
      else
        res.json(result);
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: `Database error while retrieving Credits.`}).end();
    }
  });

  // POST /api/pianodistudi
app.post('/api/pianodistudi',isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    

    try {
      await dao.insertCourse(req.body.codice,req.user.matricola);
      res.status(201).end();
    } catch(err) {
      res.status(503).json({error: `Database error during the insert of course.`});
    }
  });

// DELETE /api/pianodistudi
app.delete('/api/pianodistudi/:codiceCorso',isLoggedIn, async (req, res) => {
    try {
      await dao.deleteCourse(req.params.codiceCorso,req.user.matricola);
      res.status(204).end();
    } catch(err) {
      res.status(503).json({ error: `Database error during the deletion of Course.`});
    }
  });

  // DELETE /api/pianodistudi
app.delete('/api/pianodistudi',isLoggedIn, async (req, res) => {
  try {
    const ps=await dao.listStudyPlan(req.user.matricola);
    await dao.deleteAll(req.user.matricola);
    for(const c of ps){
      await dao.updateCourse(c);
    }
    res.status(204).end();
  } catch(err) {
    res.status(503).json({ error: `Database error during the deletion of Courses.`});
  }
});


  // GET /api/studenti
app.get('/api/studenti', async (req, res) => {
  try {
    const studenti = await userDao.listStudents(); 
    return res.status(200).json(studenti)
  } catch(e) {
   console.log(e)
    res.status(500).json({ error: `Database error while retrieving students .`}).end();
  }
  });

// GET /api/studenti/:id
app.get('/api/studenti/:id', async (req, res) => {
  try {
    const result = await userDao.getUserById(req.params.id);
    if(result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: `Database error while retrieving student.`}).end();
  }
});
// PUT /api/studenti<id>

app.put('/api/studenti/:id', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const user =  {
      matricola: req.user.matricola,
      email: req.user.email,
      nome: req.user.nome,
      fulltime: req.body.fulltime
    };
    console.log(user) 

    // you can also check here if the code passed in the URL matches with the code in req.body
    try {
      await userDao.updateUser(user);
      res.status(200).end();
    } catch(err) {
      res.status(503).json({error: `Database error during the update of user.`});
    }
  
  });

  

app.put('/api/corsi/:id',async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const course =  {
    codice: req.body.codice,
    nome: req.body.nome,
    crediti: req.body.crediti,
    postioccupati: req.body.postioccupati,
    maxstudenti: req.body.maxstudenti,
    propedeuticita:req.body.propedeuticita
  };
  
  try {
    await dao.updateCourse(course);
    res.status(200).end();
  } catch(err) {
    res.status(503).json({error: `Database error during the update of course ${req.params.id}.`});
  }

});



/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });
  
  // DELETE /sessions/current 
  // logout
  app.delete('/api/sessions/current', (req, res) => {
    req.logout( ()=> { res.end(); } );
  });
  
  // GET /sessions/current
  // check whether the user is logged in or not
  app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
  });
  
  /* Other express-related instructions */
  
  // Activate the server
  app.listen(port, () => {
    console.log(`react-score-server listening at http://localhost:${port}`);
  });  





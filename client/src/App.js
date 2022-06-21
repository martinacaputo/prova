import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Courses } from './CourseTable';
import { LoginForm, LogoutButton } from './LoginComponents';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from 'react-router-dom';
import API from './API';
import { Container,Row,Col,Alert } from 'react-bootstrap';
import {StudyPlan} from './StudyPlan';
function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan]=useState([]);
  const [loggedIn, setLoggedIn] = useState(false);  // no user is logged in when app loads
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [dirty, setDirty]=useState(false);
  const [crediti, setCrediti]=useState(0);
  const [updatedC, setUpdatedC]=useState([]);
  const navigate = useNavigate();

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if(loggedIn){
      API.getStudyPlan()
        .then( (studyPlan) => {setStudyPlan(studyPlan); } )
        .catch( err => handleError(err));
        API.getCreditsStudent()
        .then( (e) => {setCrediti(e); } )
        .catch( err => handleError(err));
    }
  }, [loggedIn])

  


  useEffect( () => {
      
    API.getAllCourses()
      .then( (courses) => {setDirty(true);setCourses(courses);} )
      .catch( err => handleError(err) );
    
  },[dirty])

  function handleError(err) {
    console.log(err);
  }
  
  function suppxcancelSP(studyPlan){
    setStudyPlan(studyPlan);
  }
  function suppxcancelCr(crediti){
    setCrediti(crediti);
  }
  function suppxcancelC(corsi){
    setCourses(corsi);
    console.log(courses);
  }

  function azzeraStudyPlan(){
    setStudyPlan([]);
  }
  function azzeraCrediti(){
    setCrediti(0);
  }

  function deleteCourse(corso) {
    setStudyPlan( courses => courses.filter( e => e.codice != corso.codice));
    setCrediti(crediti-corso.crediti);
    
 }

 function addCourse(corso) {
  setStudyPlan( oldCourses => [...oldCourses, corso] );
  setCrediti(crediti+corso.crediti);
 
  
}

function updateFullTime(fulltime){
  let user1={matricola:user.matricola,email:user.email,nome:user.nome,fulltime:fulltime}
setUser(user1);

API.updateFullTime(user,fulltime)
    .then( () => {setDirty(true); setUser(user1); })
    .catch( err => handleError(err) );
    setUser(user1);
}

function updatePostiOccupati(corso,add){
    let c1;
  courses.map((c)=>{
      if(c.codice==corso.codice){
       if(add==true){
        c.postioccupati++;
       }
       else{if( c.postioccupati-1>=0){
          c.postioccupati--;
          }
       }
       c1=c;
      }
      return c;
    });
    setUpdatedC(updatedC.filter(e=>e.codice!=corso.codice));
    setUpdatedC(oldCourses => [...oldCourses, c1]);
    
  
}

const doLogIn = (credentials) => {
 
  API.logIn(credentials)
    .then( user => {
      setLoggedIn(true);
      setUser(user);
      setMessage('');
      navigate('/');
    })
    .catch(err => {
      setMessage(err);
    }
      )
}

const doLogOut = async () => {
  await API.logOut();
  setLoggedIn(false);
  setUser({});
  setStudyPlan([]);
  azzeraCrediti();
}


  return (
    <>
     
      
      <Row><Col>
      </Col></Row>
      <Row><Col>
        {message ? <Alert variant='danger' onClose={() => setMessage('')} dismissible>{message}</Alert> : false}
        </Col></Row>
   
    <Routes>  
    <Route path='/' element={
            loggedIn ?(
          <StudyPlan suppxcancelSP={suppxcancelSP} suppxcancelCr={suppxcancelCr} suppxcancelC={suppxcancelC} logout={doLogOut} loggedin={loggedIn} edit={false} updatedC={updatedC} updatePostiOccupati={updatePostiOccupati} azzeraCrediti={azzeraCrediti} azzeraStudyPlan={azzeraStudyPlan} updateFullTime={updateFullTime} contr={studyPlan.length} crediti={crediti} courses={courses} user={user} addCourse={addCourse} studyPlan={studyPlan} deleteCourse={deleteCourse}/> 
          ): <Courses logout={doLogOut} loggedin={loggedIn} edit={false} updatePostiOccupati={updatePostiOccupati} studyPlan={studyPlan} courses={courses} add={false} addCourse={addCourse} user={user} crediti={crediti}/>
          } />
    
    <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginForm login={doLogIn} />} />
    </Routes>
    </>
  );
}

export default App;

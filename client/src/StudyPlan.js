import { Container, Row, Col, Table, Button,Form,Alert } from 'react-bootstrap';
import { useState } from 'react';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navigate, useNavigate } from 'react-router-dom';
import API from './API';
import {Courses} from './CourseTable';
export { StudyPlan }

function StudyPlan(props) {
  const [errorMsg, setErrorMsg] = useState('');
  const [edit,setEdit]=useState(props.edit);
  const [ft, setFt] = useState(props.user.fulltime);

  async function cancellaModifiche(){
    setEdit(false);
    await API.getStudyPlan()
    .then( (studyPlan) => {props.suppxcancelSP(studyPlan); } )
    .catch();
   
    await API.getAllCourses()
    .then( (courses) => {props.suppxcancelC(courses);} )
    .catch(  );
     await API.getCreditsStudent()
    .then( (e) => {props.suppxcancelCr(e); } )
    .catch( );

  }
  function setFt1(value){
    setFt(value);
  }
const handleSubmit =async (event)=>{
  event.preventDefault();
  if (ft==1 && props.crediti>80){
    setErrorMsg('Superato il numero limite di crediti, eliminare corsi per continuare');
  }else
  if(ft==1 && props.crediti<60){
        setErrorMsg('Il numero minimo di crediti è 60, aggiungere corsi al piano di studi');
  }else
  if (ft==0 && props.crediti>40){
    setErrorMsg('Superato il numero limite di crediti, eliminare corsi per continuare');
  }else
  if(ft==0 && props.crediti<20){
        setErrorMsg('Il numero minimo di crediti è 20, aggiungere corsi al piano di studi');
  }else{
    setErrorMsg('');
   
   

  await API.deleteAll();

 

  for (const corso of props.studyPlan){
    await API.addCourse(corso.codice);
  }
  for(const c of props.updatedC){
    await API.updateCourse(c);
  }
  setEdit(false);
}
}
async function deleteAllSP() {
 
  
  props.azzeraStudyPlan();
  props.azzeraCrediti();

  await API.deleteAll();

  for(const c of props.studyPlan){
    props.updatePostiOccupati(c,false);
    await API.updateCourse({codice:c.codice,postioccupati:c.postioccupati-1});

  }
}
const navigate = useNavigate();

      return (
        <>
      <Courses logout={props.logout} loggedin={props.loggedin} updatePostiOccupati={props.updatePostiOccupati} edit={edit} courses={props.courses} studyPlan={props.studyPlan} add={true} addCourse={props.addCourse} user={props.user} crediti={props.crediti}></Courses>
      <h1 className="tit1">Piano di studi</h1> 
      <p id="mat">matricola: s{props.user.matricola}</p>
      <h5>  
      
      
        {((ft === 1 && edit==true) ||(ft === 1 && props.studyPlan.length!=0) ) ?  
        <p id="mat">Crediti: min 60 max 80</p> :(edit==true || props.studyPlan.length!=0)?
        <p id="mat">Crediti: min 20 max 40</p>:''
      }
      
      </h5>
      {edit==true?
      <>
      <Form onSubmit={handleSubmit}>
      {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
      <SPTable edit={edit} setFt1={setFt1} ft={ft} studyPlan={props.studyPlan} updateFullTime={props.updateFullTime}  deleteCourse={props.deleteCourse} user={props.user} updatePostiOccupati={props.updatePostiOccupati} crediti={props.crediti} ></SPTable>
      <Button type="submit"  id='but' >SAVE</Button>
      <Button type="button"  id='but' onClick={()=>{cancellaModifiche();}}>CANCEL</Button>
      <Button type="button"  id='but' onClick={()=>{deleteAllSP();setEdit(false);}}>DELETE ALL</Button>
      </Form>
      </>:
      <>
      <SPTable  edit={edit}  setFt1={setFt1} ft={ft} studyPlan={props.studyPlan} updateFullTime={props.updateFullTime} deleteCourse={props.deleteCourse} user={props.user} updatePostiOccupati={props.updatePostiOccupati} crediti={props.crediti} ></SPTable>
      <div id='but'  title="Edit Study Plan"><svg onClick={()=>setEdit(true)} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg></div>
      </>
      }
      </>
      );
    }

    function SPTable(props) {


        return (
          <>
        {props.studyPlan.length!==0 && <h2 id="mat">Crediti {props.crediti} </h2> }

          <div id="cont">
          {props.studyPlan.length!=0 ?
            <div id="content">
              <Table>
              <thead><tr>
              <th>Codice</th>
              <th>Nome</th>
              <th>Crediti</th>
              <th></th>
              <th></th>
              </tr></thead>
                <tbody id="tab">

                   { props.studyPlan.map((f,idx) => <CourseRow key={idx} edit={props.edit} corso={f} updatePostiOccupati={props.updatePostiOccupati} studyPlan={props.studyPlan} deleteCourse={props.deleteCourse}/>)}
                 
                   
                </tbody>
              </Table>
            </div>:
            <>
            {props.studyPlan.length===0 && props.edit==false && <><h3>Crea il tuo piano di studi</h3><h4>Scegli opzione:</h4></>}

            {(props.ft === 1 && props.edit==false && props.studyPlan.length===0) ?
        
        <><input type="checkbox" onChange={() => { props.setFt1(0);   props.updateFullTime(0);}} className="input" checked />fulltime <p>Crediti: min 60 max 80</p> </> :(props.edit==false  && props.studyPlan.length===0)?
    
        <><input type="checkbox" onChange={() => { props.setFt1(1);   props.updateFullTime(1);}} className="input" />fulltime  <p>Crediti: min 20 max 40</p> </>:''
    }
            </>
             }
            </div>
            
            </>
        );
      }

      function CourseRow(props){

          function contrProp(){
            for(const c of props.studyPlan){
              if( c.propedeuticita==props.corso.codice){
                return true;
              }
            }
            return false;
          }
          function corsoProp(){
            for(const c of props.studyPlan){
              if( c.propedeuticita==props.corso.codice){
                return c.nome;
              }
            }
            return '';
          }
        return (
            <>
            <tr className="tr">
              <th>{props.corso.codice}</th>
                <td>{props.corso.nome}</td>
                <td>{props.corso.crediti}</td>    
                <td></td>
                <td></td>
                {(props.edit==true && !contrProp())?
                  <td title="Rimuovi corso" >
                    <svg  onClick={() => { props.deleteCourse(props.corso);  props.updatePostiOccupati(props.corso,false); }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
</svg></td> 
                  : (props.edit==true && contrProp())? <td title= {'Non puoi eliminare questo corso\n perchè è propedeutico per '+corsoProp()} ><svg xmlns="http://www.w3.org/2000/svg"  width="25" height="25" fill="red" id="x" className="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg></td>:''
              }
            </tr>
             
            </>
          );
      }
import { Container, Row, Col, Table, Button,Form, Alert } from 'react-bootstrap';
import { LoginForm, LogoutButton } from './LoginComponents';
import { useState } from 'react';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
export { Courses }

function Courses(props) {
  const navigate = useNavigate();
    return (
      <><header className="p-3 mb-2 bg-dark text-dark">
     
        <Row>
          <Col>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-journal-bookmark" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8z"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
</svg>
            <span id="testo">Study Plan</span>
            </Col>
            <Col>
            </Col>
            <Col>
            </Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            <Col></Col>
            {props.loggedin ? <LogoutButton logout={props.logout} user={props.user} /> : 
            <Col id="logIn" title="Log In">
            <svg  onClick={()=>navigate(`/login`)}  xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" className="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
            </svg>
            </Col>} 

       
          
          
        </Row>
     
    </header>
    <CourseTable edit={props.edit} updatePostiOccupati={props.updatePostiOccupati} user={props.user} studyPlan={props.studyPlan} add={props.add} addCourse={props.addCourse} courses={props.courses} crediti={props.crediti}></CourseTable>
    </>
    );
  }

  function CourseTable(props) {

   
    return (
      <>
      <h5 className="tit">Courses</h5>
      <div id="cont">
        <div  id="content">

          <Table>
            <thead><tr>
              <th>Codice</th>
              <th>Nome</th>
              <th>Crediti</th>
              <th>studenti iscritti</th>
              <th>massimo numero di iscritti</th>
              </tr></thead>
            <tbody id="tab">
            
               {
                props.courses.map((f,idx) => <CourseRow edit={props.edit} key={idx}  updatePostiOccupati={props.updatePostiOccupati} studyPlan={props.studyPlan} user={props.user} corso={f} courses={props.courses} add={props.add} crediti={props.crediti} addCourse={props.addCourse}/>)
              }
               
            </tbody>
          </Table>
        </div>
        </div>
        
        </>
    );
  }

  function CourseRow(props){
    const [show, setShow]=useState(false);
    const [showProp, setShowProp]=useState(false);
    
    function Isincompatibile(corso){
      if(props.add==true){
      for (let i=0;i<props.studyPlan.length;i++){
            for(let j=0;j<props.courses.length;j++){
              if(props.courses[j].codice===corso.codice){
                for(let k=0;k<props.courses[j].incomp.length;k++){
                 if(props.courses[j].incomp[k].codice==props.studyPlan[i].codice){
                    return true;
                  }
                }
              }
            }
            
          }
      }
      return false;
    }
    function incompatibileC(corso){
      if(props.add==true){
      for (let i=0;i<props.studyPlan.length;i++){
            for(let j=0;j<props.courses.length;j++){
              if(props.courses[j].codice===corso.codice){
                for(let k=0;k<props.courses[j].incomp.length;k++){
                 if(props.courses[j].incomp[k].codice==props.studyPlan[i].codice){
                    return props.studyPlan[i].nome;
                  }
                }
              }
            }
            
          }
      }
      return '';
    }

    function IsAlreadyIn(corso){
      if(props.add==true){
      for (let i=0;i<props.studyPlan.length;i++){
        if(corso.codice==props.studyPlan[i].codice){
          return true;
        }
            
        }
      }
      return false;
    }

    function contrProped(corso){
      if(corso.prop.codice){
        for(let c of props.studyPlan){
            if(c.codice==corso.prop.codice){          
              return true;
            }
        }
        return false;
      }
      return true;
    }
    function corsoFull(corso){
      if(corso.postioccupati===corso.maxstudenti){
        return true;
      }
      return false;
    }
    function contr(corso){
      if(props.add==true && contrProped(props.corso) && props.edit==true && !Isincompatibile(props.corso) && !IsAlreadyIn(props.corso) && !corsoFull(props.corso)){
        return 1;
      }
      if(corsoFull(props.corso) && props.edit==true ){
        return 6;
      }
      if(!contrProped(props.corso) && props.edit==true){
        return 4;
      }
      if(IsAlreadyIn(props.corso) && props.edit==true ){
        return 2;
      }
      if(Isincompatibile(props.corso) && props.edit==true ){
        return 3;
      }
       else return 5;
    }
    
    return (
        <>
        
        <tr className="tr">
          {Isincompatibile(props.corso) ? <><th className="red">{props.corso.codice}</th>
          <td className="red">{props.corso.nome}</td>
            <td className="red">{props.corso.crediti}</td>    
            <td className="red">{props.corso.postioccupati}</td>
            <td className="red">{props.corso.maxstudenti}</td>
          </> :
          <>
          <th >{props.corso.codice}</th>
            <td>{props.corso.nome}</td>
            <td>{props.corso.crediti}</td>    
            <td>{props.corso.postioccupati}</td>
            <td>{props.corso.maxstudenti}</td>
          </>
            }
            <td  title='Clicca qui per info sul corso'>
            <svg onClick={()=>{setShow(!show);setShowProp(!showProp);}} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
</svg>
</td>
            { contr(props.corso)==1 &&
              <td title='Aggiungi corso'>
               <svg onClick={()=>{
               
               props.addCourse(props.corso);
               props.updatePostiOccupati(props.corso,true);
              
             }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
</svg> 
                </td>
              }
            { contr(props.corso)==2 &&
              <td title="Corso già inserito" ><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg></td>
              }
            { contr(props.corso)==3 &&
              <td title= {'Incompatibile con '+incompatibileC(props.corso)} ><svg xmlns="http://www.w3.org/2000/svg"  width="25" height="25" fill="red" id="x" className="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg></td>
              }
            { contr(props.corso)==4 &&
              <td title= {'Manca corso propedeutico:\n '+props.corso.prop.nome} ><svg xmlns="http://www.w3.org/2000/svg"  width="25" height="25" fill="blue" id="x" className="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg></td>
              } 
              { contr(props.corso)==6 &&
              <td title= {'Non ci sono posti disponibili\n per questo corso'} ><svg xmlns="http://www.w3.org/2000/svg"  width="25" height="25" fill="red" id="x" className="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg></td>
              } 
              

            
        </tr>
       
        { showProp && props.corso.prop.codice!=undefined ? 
                  <tr className="tr" id="inc">
                  <CourseRowIncomp corso={props.corso.prop} incomp={'Propedeutico'}/> 
                  </tr>
                : (showProp && props.corso.prop.codice==undefined && props.corso.incomp.length==0)? <tr id="inc"><CourseRowIncomp  incomp={'Nessun vincolo'}/></tr>: ''
          }

         { show?       props.corso.incomp.map((f,idx) =>
                
                <tr className="tr" id="inc">
                  
                   <CourseRowIncomp key={idx} corso={f} incomp={'Incompatibile'}/> 
                   
                </tr>
                ): ''
              
              }
        </>
      );
  }

  function CourseRowIncomp(props){
    return (
        <>
        {props.incomp!='Nessun vincolo' ?
         <><th>{props.incomp}</th>
          <td>{props.corso.codice}</td>
            <td>{props.corso.nome}</td>
            <td></td>    
            <td></td>
            <td></td>
            </>:
            <>
            <th>Nessun Vincolo</th>
            <td></td>    
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </>
        }
        
        </>
      );
  }

  
 

import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useNavigate } from 'react-router-dom';
import './App.css';


function LoginForm(props) {
  const [username, setUsername] = useState('test@polito.it');
  const [password, setPassword] = useState('password');
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      // SOME VALIDATION, ADD MORE!!!
      let valid = true;
      if(username === '' || password === '')
          valid = false;
      
      if(valid)
      {
        props.login(credentials);
        
      }
      else {
        // show a better error message...
        setErrorMessage('Error(s) in the form, please fix it.')
      }
  };

  return (
      <Container id="formm">
          <Row>
              <Col>
                  <h2>Login</h2>
                  <Form id="formm">
                      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                      <Form.Group controlId='username'>
                          <Form.Label>Email</Form.Label>
                          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                      </Form.Group>
                      <Form.Group controlId='password'>
                          <Form.Label>Password</Form.Label>
                          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                      </Form.Group>
                      <Button onClick={handleSubmit}>Login</Button>
                  </Form>
              </Col>
          </Row>
      </Container>
    )
}

function LogoutButton(props) {
  return(
    <Col id="logOut" title='Log Out'>
      <svg onClick={props.logout} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
</svg>
    </Col>
  )
}

export { LoginForm, LogoutButton };
/**
 * All the API calls
 */

 const APIURL = new URL('http://localhost:3008/api/');  // Do not forget '/' at the end

 async function getAllCourses() {
    // call  /api/corsi
    const response = await fetch(new URL('corsi', APIURL));
    const courseJson = await response.json();
    if (response.ok) {
      return courseJson.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, postioccupati:e.postioccupati, maxstudenti:e.maxstudenti,propedeuticita:e.propedeuticita,incomp:e.incomp,prop:e.prop }) )
    } else {
      throw courseJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

  async function getIncompatibilities(codiceCorso) {
     // call  /api/corsi
     const response = await fetch(new URL('incompatibilita/' + codiceCorso, APIURL));
     const courseJson = await response.json();
     if (response.ok) {
       return courseJson.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, postioccupati:e.postioccupati, maxstudenti:e.maxstudenti,propedeuticita:e.propedeuticita }) )
     } else {
       throw courseJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
     }
  }

  async function getStudyPlan() {
    // call  /api/corsi
    const response = await fetch(new URL('pianodistudi/', APIURL),{credentials: 'include'});
    const courseJson = await response.json();
    if (response.ok) {
      return courseJson.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, postioccupati:e.postioccupati, maxstudenti:e.maxstudenti,propedeuticita:e.propedeuticita }) )
    } else {
      throw courseJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

  async function getCreditsStudent() {
    // call  /api/corsi
    const response = await fetch(new URL('creditistudente/', APIURL),{credentials: 'include'});
    const courseJson = await response.json();
    if (response.ok) {
      return courseJson;
    } else {
      throw courseJson;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
    }
  }

  function deleteCourse(codiceCorso) {
    return new Promise((resolve, reject) => {
      fetch(new URL('pianodistudi/' + codiceCorso, APIURL), {
        method: 'DELETE',
        credentials: 'include',
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  function updateCourse(corso){
    return new Promise((resolve, reject) => {
      fetch(new URL('corsi/' +corso.codice , APIURL), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({codice: corso.codice, nome: corso.nome, crediti: corso.crediti, postioccupati:corso.postioccupati, maxstudenti:corso.maxstudenti,propedeuticita:corso.propedeuticita }),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  function deleteAll() {
    return new Promise((resolve, reject) => {
      fetch(new URL('pianodistudi/', APIURL), {
        method: 'DELETE',
        credentials: 'include',
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

  function addCourse(codiceCorso) {
    return new Promise((resolve, reject) => {
      fetch(new URL('pianodistudi', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codice: codiceCorso }),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  
  function updateFullTime(studente,fulltime) {
    
    return new Promise((resolve, reject) => {
      fetch(new URL('studenti/' +studente.matricola+ fulltime , APIURL), {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricola:studente.matricola, email:studente.email, nome:studente.nome, fulltime:fulltime  }),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((obj) => { reject(obj); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }


  async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
  }
  
  async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }

  const API={updateCourse,deleteAll,updateFullTime,getUserInfo,logIn,logOut,addCourse,deleteCourse,getCreditsStudent,getStudyPlan,getIncompatibilities,getAllCourses};

  export default API;
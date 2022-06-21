'use strict';
/* Data Access Object (DAO) */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('exams.sqlite', (err) => {
  if(err) throw err;
});

// get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT codice,nome,crediti,(SELECT COUNT (*) FROM pianodistudi WHERE corso=codice) as postioccupati,maxstudenti,propedeuticita FROM corsi ORDER BY nome';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const courses = rows.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, postioccupati:e.postioccupati, maxstudenti:e.maxstudenti,propedeuticita:e.propedeuticita }));
        resolve(courses);
      });
    });
  };


// get a course
exports.getACourse = (codiceCorso) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT codice,nome,crediti,postioccupati,maxstudenti,propedeuticita FROM corsi WHERE codice=?';
    db.get(sql, [codiceCorso], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row==undefined){
        resolve({error: 'Course not found.'});
      }else{
      const courses ={ codice: row.codice, nome: row.nome, crediti: row.crediti, postioccupati:row.postioccupati, maxstudenti:row.maxstudenti, propedeuticita:row.propedeuticita};
      resolve(courses);
      }
    });
  });
};

// get incompatibilità
exports.listIncompatibility = (corso) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT codice,nome,crediti,postioccupati,maxstudenti FROM incompatibilita I, corsi C WHERE I.corso=? AND I.incomp=C.codice';
      db.all(sql, [corso], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const courses = rows.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, postioccupati:e.postioccupati, maxstudenti:e.maxstudenti}));
        resolve(courses);
      });
    });
  };


//get pianostudi

exports.listStudyPlan=(studente)=>{
    return new Promise((resolve, reject) => {
      const sql = 'SELECT codice,nome,crediti,postioccupati,maxstudenti,propedeuticita FROM pianodistudi P,corsi C where P.studente=? and P.corso=C.codice';
      db.all(sql, [studente], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const courses = rows.map((e) => ({ codice: e.codice, nome: e.nome, crediti: e.crediti, postioccupati:e.postioccupati, maxstudenti:e.maxstudenti,propedeuticita:e.propedeuticita }));
        resolve(courses);
      });
    });
  };

//get crediti studente

exports.creditsStudent=(studente)=>{
    return new Promise((resolve, reject) => {
      const sql = 'SELECT SUM(crediti) as totcrediti  FROM pianodistudi P,corsi C where P.studente=? and P.corso=C.codice';
      db.get(sql, [studente], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row.totcrediti);
      });
    });
  };



// inserisci un corso nel piano di studi
exports.insertCourse = (corso, studente) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO pianodistudi(studente, corso) VALUES(?,?)';
      db.run(sql, [studente,corso], function (err) {  // <-- NB: function, NOT arrow function so this.lastID works
        if (err) {
          reject(err);
          return;
        }
        console.log('inserCourse lastID: '+this.lastID);
        resolve(this.lastID);
      });
    });
  };

// elimina corso dal piano di studi
exports.deleteCourse = (corso, studente) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM pianodistudi WHERE studente = ? AND corso = ?';
      db.run(sql, [studente, corso], (err) => {
        if (err) {
          reject(err);
          return;
        } else
          resolve(null);
      });
    });
  }

// elimina corso dal piano di studi
exports.deleteAll = (studente) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM pianodistudi WHERE studente = ? ';
    db.run(sql, [studente], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

exports.updateCourse =(course) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE corsi SET postioccupati=(SELECT COUNT (*) FROM pianodistudi WHERE corso=?) WHERE codice=?';
    
    db.run(sql, [course.codice, course.codice], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};




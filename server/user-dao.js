'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('exams.sqlite', (err) => {
    if(err) throw err;
  });

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM studenti WHERE matricola = ?';
      db.get(sql, [id], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {
          const user = {matricola: row.matricola, email: row.email,nome: row.nome, fulltime:row.fulltime }
          resolve(user);
        }
    });
  });
};
  // get all students
  exports.listStudents = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM studenti ';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const courses = rows.map((row) => ({ matricola: row.matricola, email: row.email,nome: row.nome, fulltime:row.fulltime }));
        resolve(courses);
      });
    });
  };
  
  // update an existing films
exports.updateUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE studenti SET fulltime=? WHERE matricola = ?';
    db.run(sql, [ user.fulltime, user.matricola], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};
  //update full or part time
  exports.updateFullTime = (matricola,fulltime) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE studenti SET fulltime=? WHERE matricola=?';
      db.run(sql, [fulltime, matricola], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  };
exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM studenti WHERE email = ?';
      db.get(sql, [email], (err, row) => {
        if (err) { reject(err); }
        else if (row === undefined) { resolve(false); }
        else {
          const user = {matricola: row.matricola, email: row.email, nome: row.nome, fulltime: row.fulltime};
          
          const salt = row.SALT;
          crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
            if (err) reject(err);

            const passwordHex = Buffer.from(row.password, 'hex');

            if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
              resolve(false);
            else resolve(user); 
          });
        }
      });
    });
  };
  

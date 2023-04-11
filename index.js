const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST","DELETE","PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "res_id",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

var user_detail = "";
var loggedIn_server = false ;
var project_id = "";
var publication_id = "";
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "tdri_system",
  
})

// app.get('/resercher',(req,res)=>{
//   db.query("SELECT * FROM resercher", (err,result)=>{
//     if(err){
//       console.log(err);
//     }
//     else{
//       res.send(result);
//     }
//   });
// });


//----------------------------------------register resercher--------------------------

app.post('/register', (req, res) => {
  const res_username = req.body.res_username;
  const res_name = req.body.res_name;
  const res_email = req.body.res_email;
  const res_pass = req.body.res_pass
  const res_tel = req.body.res_tel;

  // bcrypt.hash(res_pass, saltRounds, (err, hash) => {
  //   if (err) {
  //     console.log(err);
  //   }

    db.query(
      "INSERT INTO resercher (res_username, res_name , res_email, res_pass, res_tel) VALUES (?,?,?,?,?)",
      [res_username, res_name, res_email, res_pass, res_tel],
      (err, result) => {
        console.log(err);
      }
    );
  // });
});



//----------------------------------------login resercher--------------------------


app.get("/login_user", (req, res) => {
  //req.session.user = test;
  console.log("loggedIn_server");
  console.log(loggedIn_server);
  //req.session.save()
  if (req.session.user && loggedIn_server == true) {
    console.log("if");
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    if(loggedIn_server == true){
      console.log("esle if");
      req.session.user = user_detail;
      res.send({ loggedIn: true, user: req.session.user });
    }else{
      console.log("esle else");
      loggedIn_server = false;
      res.send({ loggedIn: false });
    }
    //console.log("else");
    //res.send({ loggedIn: false });
  }
});


//----------------------------------------login resercher--------------------------

app.post('/login', (req, res) => {
  const res_username = req.body.res_username;
  const res_pass = req.body.res_pass;

  db.query(
    "SELECT * FROM resercher WHERE res_username = ?",
    res_username,
    (err, result) => {
      if (err) {
        loggedIn_server = false;
        res.send({ err: err });
      }
      
      if (result.length > 0) {
        // bcrypt.compare(res_pass, result[0].res_pass, (error, response) => {
          if (result[0].res_pass == res_pass) {
            req.session.user = result;
            user_detail = result ;
            loggedIn_server = true;
            //console.log("login");
            //console.log(test.loggedIn);
            //console.log(req.session.user);
            console.log(user_detail[0].res_id);
            res.send(result);
          } else {
            loggedIn_server = false;
            res.send({ message: "password ไม่ถูกต้อง!" });
          }
        // });
      }else {
        loggedIn_server = false;
        res.send({ message: "ไม่พบ username นี้ในระบบ" });
      }
    }
  );
});

//----------------------------------------log out--------------------------

app.get('/logout', (req, res) => {
  user_detail = "";
  loggedIn_server = false ;
  req.session.user = user_detail;
  req.session.destroy();
  res.send("logout");
});

//----------------------------------------researcher--------------------------
app.get('/show_resercher',(req,res)=>{
  const res_id = user_detail[0].res_id;
  db.query("SELECT * FROM resercher WHERE  res_id = ?",res_id, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});





//----------------------------------------show project List--------------------------
app.get('/project',(req,res)=>{
  db.query("SELECT * FROM project", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/project/Ongoing_Research',(req,res)=>{
  db.query("SELECT proj_id,th_name,proj_status,proj_keyword,proj_data,start_date FROM project WHERE proj_status = 01", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/project/Complete_Research',(req,res)=>{
  db.query("SELECT proj_id,th_name,proj_status,proj_keyword,proj_data,start_date FROM project WHERE proj_status = 00", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});


//----------------------------------------show publication List--------------------------
app.get('/publication',(req,res)=>{
  db.query("SELECT * FROM publication", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show publication List--------------------------
app.get('/publication/TQR',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10 || catagory = 20 || catagory = 30", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/TQO',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10 || catagory = 20 || catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/TRO',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10 || catagory = 30 || catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/QRO',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 20 || catagory = 30 || catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/TQ',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10 || catagory = 20", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/TR',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10 || catagory = 30", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/TO',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10 || catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/QR',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 20 || catagory = 30", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/QO',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 20 || catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/RO',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 30 || catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/TDRI_Repport',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 10", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/Quaterly_Review',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 20", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/Research',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 30", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/publication/Other',(req,res)=>{
  db.query("SELECT * FROM publication WHERE catagory = 40", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});



//----------------------------------------show member list--------------------------

app.get('/show_member_list',(req,res)=>{
  db.query("SELECT ml_name FROM member_list ; ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//---------------------------------add member list ------------------------------

app.post('/add_member_list', (req, res) => {
  const ml_name = req.body.ml_name;
  

  db.query(
    "INSERT INTO member_list (ml_name) VALUES (?)",
    [ml_name],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {

        res.send("Values Inserted");
      }
    }
  );
});

//----------------------------------------show keyword list-------------------------- 

app.get('/show_keyword_list',(req,res)=>{
  db.query("SELECT kw_name FROM keyword_list ; ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});
//----------------------------------------show_project_id_list-------------------------- 

app.get('/show_project_id_list',(req,res)=>{
  db.query("SELECT proj_id,th_name FROM project ; ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//---------------------------------add keyword list ------------------------------

app.post('/add_keyword_list', (req, res) => {
  const kw_name = req.body.kw_name;
  

  db.query(
    "INSERT INTO keyword_list (kw_name) VALUES (?)",
    [kw_name],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {

        res.send("Keyword Inserted");
      }
    }
  );
});

//---------------------------------upload  project------------------------------

app.post('/up_project', (req, res) => {
  const th_name = req.body.th_name;
  const en_name = req.body.en_name;
  const proj_keyword = req.body.proj_keyword;
  const employer = req.body.employee
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const proj_status = req.body.proj_status;
  const proj_data = req.body.proj_data;
  const description = req.body.description;
  const proj_team_leader = req.body.proj_team_leader;
  const proj_team_member = req.body.proj_team_member;
  const res_id = req.body.res_id;

  db.query(
    "INSERT INTO project (th_name, en_name , proj_keyword, employer, start_date, end_date, proj_status, proj_data, description,proj_team_leader,proj_team_member,res_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [th_name, en_name, proj_keyword, employer, start_date, end_date,proj_status,proj_data,description,proj_team_leader,proj_team_member,res_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result")
        console.log(result)

        res.send(result);
      }
    }
  );
});

//---------------------------------upload  project admin------------------------------

app.post('/up_project_admin', (req, res) => {
  const th_name = req.body.th_name;
  const en_name = req.body.en_name;
  const proj_keyword = req.body.proj_keyword;
  const employer = req.body.employee
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const proj_status = req.body.proj_status;
  const proj_data = req.body.proj_data;
  const description = req.body.description;
  const proj_team_leader = req.body.proj_team_leader;
  const proj_team_member = req.body.proj_team_member;
  const ad_username = req.body.ad_username;

  db.query(
    "INSERT INTO project (th_name, en_name , proj_keyword, employer, start_date, end_date, proj_status, proj_data, description,proj_team_leader,proj_team_member,ad_username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [th_name, en_name, proj_keyword, employer, start_date, end_date,proj_status,proj_data,description,proj_team_leader,proj_team_member,ad_username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result")
        console.log(result)

        res.send(result);
      }
    }
  );
});



//-------------------------add publication--------------------------

app.post('/up_publication', (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const publ_keyword = req.body.publ_keyword;
  const catagory = req.body.catagory
  const fi_code = req.body.fi_code;
  const publish_date = req.body.publish_date;
  const publ_data = req.body.publ_data;
  const remark = req.body.remark;
  const proj_id = req.body.proj_id;
  const res_id = req.body.res_id;
  // console.log('proj_id');
  // console.log(proj_id);
  // console.log('------');

  db.query(
    "INSERT INTO publication (title, author , publ_keyword, catagory, fi_code, publish_date, publ_data, remark, proj_id,res_id) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [title, author, publ_keyword, catagory, fi_code, publish_date, publ_data, remark, proj_id,res_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //console.log("result")
        //console.log(result)

        res.send(result);
      }
    }
  );
});

//-------------------------add publication--------------------------

app.post('/up_publication_admin', (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const publ_keyword = req.body.publ_keyword;
  const catagory = req.body.catagory
  const fi_code = req.body.fi_code;
  const publish_date = req.body.publish_date;
  const publ_data = req.body.publ_data;
  const remark = req.body.remark;
  const proj_id = req.body.proj_id;
  const ad_username = req.body.ad_username;

  db.query(
    "INSERT INTO publication (title, author , publ_keyword, catagory, fi_code, publish_date, publ_data, remark, proj_id,ad_username) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [title, author, publ_keyword, catagory, fi_code, publish_date, publ_data, remark, proj_id,ad_username],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("result")
        console.log(result)

        res.send(result);
      }
    }
  );
});





//------------------------------------------------------------------


// app.put("/update", (req, res) => {
//   const id = req.body.id;
//   const wagw = req.body.wagw;
//   db.query(
//     "UPDATE employees SET wagw = ? WHERE id = ?",
//     [wagw, id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     }
//   );
// });

// app.delete("/delete/:id", (req, res) => {
//   const id = req.params.id;
//   db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

//----------------------------------------show project detail--------------------------
// app.get('/project_detail/:id',(req,res)=>{
//   const id = req.params.id;
//   db.query("SELECT * FROM project WHERE proj_id = ?",id, (err,result)=>{
//     if(err){
//       console.log(err);
//     }
//     else{
//       res.send(result);
//     }
//   });
// });

//----------------------------------------show project detail--------------------------
app.post('/project_id',(req,res)=>{
  project_id = req.body.proj_id;
  res.send("yes");
});

//----------------------------------------show project detail--------------------------
app.get('/project_detail',(req,res)=>{
  const id = project_id;
  db.query("SELECT * FROM project WHERE proj_id = ?;", id,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show publication detail--------------------------

app.post('/publication_id',(req,res)=>{
  publication_id = req.body.publication_id;
  res.send("yes");
});

//----------------------------------------show publication detail--------------------------
app.get('/publication_detail',(req,res)=>{
  const id = publication_id;
  db.query("SELECT * FROM publication WHERE publ_id = ?;", id,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show project history--------------------------
app.get('/project_history',(req,res)=>{
  //const id = project_id;
  const res_id = user_detail[0].res_id;
  db.query("SELECT * FROM project WHERE res_id = ?;", res_id,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show publication history--------------------------
app.get('/publication_history',(req,res)=>{
  //const id = project_id;
  const res_id = user_detail[0].res_id;
  db.query("SELECT * FROM publication WHERE res_id = ?;", res_id,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show project history admin--------------------------
app.get('/project_history_admin',(req,res)=>{
  //const id = project_id;
  const ad_username = user_detail[0].ad_username;
  db.query("SELECT * FROM project WHERE ad_username = ?;", ad_username,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show publication history admin--------------------------
app.get('/publication_history_admin',(req,res)=>{
  //const id = project_id;
  const ad_username = user_detail[0].ad_username;
  db.query("SELECT * FROM publication WHERE ad_username = ?;", ad_username,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});
//----------------------------------------delete project --------------------------


app.delete("/delete_project/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM project WHERE proj_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("yes");
    }
  });
});

//----------------------------------------delete Publication --------------------------


app.delete("/delete_Publication/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM publication WHERE publ_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("yes");
    }
  });
});


//----------------------------------------edit project --------------------------
app.get("/edit_project/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT *  FROM project WHERE proj_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.put("/update_project", (req, res) => {
  // const id = req.body.id;
  // const wagw = req.body.wagw;
  const th_name = req.body.th_name;
  const en_name = req.body.en_name;
  const proj_keyword = req.body.proj_keyword;
  const employer = req.body.employee
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const proj_status = req.body.proj_status;
  const proj_data = req.body.proj_data;
  const description = req.body.description;
  const proj_team_leader = req.body.proj_team_leader;
  const proj_team_member = req.body.proj_team_member;
  const proj_id = req.body.proj_id;
  //const res_id = req.body.res_id;
  db.query(
    "UPDATE project SET th_name = ?,en_name = ? ,proj_keyword = ? ,employer = ? ,start_date = ? ,end_date = ? ,proj_status = ? ,proj_data = ? ,description = ?,proj_team_leader = ?,proj_team_member = ? WHERE proj_id = ?",
    [th_name, en_name,proj_keyword,employer,start_date,end_date,proj_status,proj_data,description,proj_team_leader,proj_team_member,proj_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//----------------------------------------edit publication --------------------------
app.get("/edit_publication/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT *  FROM publication WHERE publ_id= ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/update_publication", (req, res) => {
  // const id = req.body.id;
  // const wagw = req.body.wagw;
  const title = req.body.title;
  const author = req.body.author;
  const publ_keyword = req.body.publ_keyword;
  const catagory = req.body.catagory
  const fi_code = req.body.fi_code;
  const publish_date = req.body.publish_date;
  const publ_data = req.body.publ_data;
  const remark = req.body.remark;
  const proj_id = req.body.proj_id;
  //const res_id = req.body.res_id;
  const publ_id = req.body.publ_id;
  //const res_id = req.body.res_id;
  db.query(
    "UPDATE publication SET title = ?,author = ? ,publ_keyword = ? ,catagory = ? ,fi_code = ? ,publish_date = ? ,publ_data = ? ,remark = ? ,proj_id = ? WHERE publ_id = ?",
    [title, author,publ_keyword,catagory,fi_code,publish_date,publ_data,remark,proj_id,publ_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});


//----------------------------------------edit resercher --------------------------

app.put("/update_resercher", (req, res) => {
  
  const res_name = req.body.res_name;
  const res_username= req.body.res_username;
  const res_tel = req.body.res_tel;
  const res_email = req.body.res_email;
  const res_pass = req.body.res_pass;
  const res_id = req.body.res_id;
 
 
  db.query(
    "UPDATE resercher SET res_name = ?,res_username = ? ,res_tel = ? ,res_email = ? ,res_pass = ?  WHERE res_id = ?",
    [res_name,res_username,res_tel,res_email,res_pass,res_id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

//----------------------------------------show publication in the project --------------------------
app.get("/show_publication_in_project/:proj_id", (req, res) => {
  const id = req.params.proj_id;
  db.query("SELECT *  FROM publication WHERE proj_id= ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


//----------------------------------------login_admin_check--------------------------


app.get("/login_admin_check", (req, res) => {
  //req.session.user = test;
  console.log("loggedIn_server");
  console.log(loggedIn_server);
  //req.session.save()
  if (req.session.user && loggedIn_server == true) {
    console.log("if");
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    if(loggedIn_server == true){
      console.log("esle if");
      req.session.user = user_detail;
      res.send({ loggedIn: true, user: req.session.user });
    }else{
      console.log("esle else");
      loggedIn_server = false;
      res.send({ loggedIn: false });
    }
    //console.log("else");
    //res.send({ loggedIn: false });
  }
});

//----------------------------------------login admin--------------------------
app.post('/login_admin', (req, res) => {
  const ad_username = req.body.ad_username;
  const ad_pass = req.body.ad_pass;

  db.query(
    "SELECT * FROM admin WHERE ad_username = ?",
    ad_username,
    (err, result) => {
      if (err) {
        loggedIn_server = false;
        res.send({ err: err });
      }
      
      if (result.length > 0) {
        // bcrypt.compare(res_pass, result[0].res_pass, (error, response) => {
          if (result[0].ad_pass == ad_pass) {
            req.session.user = result;
            user_detail = result ;
            loggedIn_server = true;
            //console.log("login");
            //console.log(test.loggedIn);
            //console.log(req.session.user);
            //console.log(user_detail[0].ad_id);
            res.send(result);
          } else {
            loggedIn_server = false;
            res.send({ message: "Wrong username/password combination!" });
          }
        // });
      }else {
        loggedIn_server = false;
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});


//----------------------------------------show admin_list-------------------------- 

app.get('/admin_list',(req,res)=>{
  db.query("SELECT * FROM admin ; ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show user list-------------------------- 

app.get('/user_list',(req,res)=>{
  db.query("SELECT * FROM resercher ; ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------delete resercher --------------------------


app.delete("/delete_resercher/:id", (req, res) => {
  const res_id_d = req.params.id;
  db.query("DELETE FROM resercher WHERE res_id = ?", res_id_d, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("yes");
    }
  });
});

//----------------------------------------delete admin --------------------------


app.delete("/delete_admin/:id", (req, res) => {
  const ad_username = req.params.id;
  db.query("DELETE FROM admin WHERE ad_username = ?", ad_username, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("yes");
    }
  });
});

//----------------------------------------show user list-------------------------- 

app.get('/show_catagory_10',(req,res)=>{
  db.query("SELECT COUNT(catagory) as value FROM publication WHERE catagory ='10' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_catagory_20',(req,res)=>{
  db.query("SELECT COUNT(catagory) as value FROM publication WHERE catagory ='20' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_catagory_30',(req,res)=>{
  db.query("SELECT COUNT(catagory) as value FROM publication WHERE catagory ='30' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_catagory_40',(req,res)=>{
  db.query("SELECT COUNT(catagory) as value FROM publication WHERE catagory ='40' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

//----------------------------------------show user list-------------------------- 

app.get('/show_project_status_00',(req,res)=>{
  db.query("SELECT COUNT(proj_status) as value FROM project WHERE proj_status ='00' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});

app.get('/show_project_status_01',(req,res)=>{
  db.query("SELECT COUNT(proj_status) as value FROM project WHERE proj_status ='01' ", (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  });
});



app.post('/search_date',(req,res)=>{
  const str_date_search = req.body.str_date_search;
  const end_date_search = req.body.end_date_search;
  //publication_id = req.body.publication_id;
  db.query(
    "SELECT * FROM project WHERE start_date BETWEEN ? AND ?;",
    [str_date_search,end_date_search],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //console.log("result")
        console.log(result)

        res.send(result);
      }
    }
  );
});

app.post('/search_date_pub',(req,res)=>{
  const str_date_search = req.body.str_date_search;
  const end_date_search = req.body.end_date_search;
  //publication_id = req.body.publication_id;
  db.query(
    "SELECT * FROM publication WHERE publish_date BETWEEN ? AND ?;",
    [str_date_search,end_date_search],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //console.log("result")
        console.log(result)

        res.send(result);
      }
    }
  );
});

//----------------------------------------login resercher--------------------------

app.post('/Check_Username_Register', (req, res) => {
  const res_username = req.body.res_username;

  db.query(
    "SELECT * FROM resercher WHERE res_username = ?",
    res_username,
    (err, result) => {
      if (err) {
        //loggedIn_server = false;
        res.send({ err: err });
      }
      
      if (result.length > 0) {
        
        res.send({ message: "มีชื่อ username นี้ในระบบแล้ว" });
          
      }else {
        //loggedIn_server = false;
        res.send({ message: "Username สามารถใช่ได้" });
      }
    }
  );
});



app.listen('3001', () => {
  console.log('Server is running on port 3001');
})


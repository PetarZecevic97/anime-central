const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {client,  db,  express} = require('./global');
const user = require('./user');
const queries = require('./queries');


const app = express();

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MYSQL")
  })

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', user);

app.get('/selectallanime', (req, res, next) => {
    let query = db.query(queries.selectAllAnime, (err, results, fields) => {
      if (err) throw err;
      console.log("selected");
      res.send(results);
    })
  
});
  
app.get('/selectallanimelike/:startswith', (req, res, next) => {
    let query = db.query(queries.selectAllAnimeLike(req.params.startswith), (err, results, fields) => {
      if (err) throw err;
      console.log("selected");
      res.send(results);
    })
  
});
  
app.listen('3000', () => {
    console.log("Server started listening on port 3000.");
});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {db, express} = require('./global');
const user = require('./user_profile');
const user_related = require('./user_anime');
const anime = require('./anime');

const app = express();

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MYSQL")
  })

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Implementacija CORS zastite
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PATCH, DELETE, PUT'
    );

    return res.status(200).json({});
  }

  next();
});

app.use('/', user);
app.use('/', user_related);
app.use('/anime', anime);
  
app.listen('3000', () => {
    console.log("Server started listening on port 3000.");
});
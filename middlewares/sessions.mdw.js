
import session from "express-session";
import MySQLStore  from 'express-mysql-session'
export default function(app) {
  app.set('trust proxy', 1)
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10800000},
    store: new MySQLStore({
      connectionLimit: 100,
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'auction',
      charset: 'utf8mb4_general_ci',
      schema: {
        tableName: 'sessions',
        columnNames: {
          session_id: 'session_id',
          expires: 'expires',
          data: 'data'
        }
      }
    }),
  }))
};

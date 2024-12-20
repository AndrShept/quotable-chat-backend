import express from 'express';
import dotenv from 'dotenv';
import { routes } from './routes';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('dev'));
app.use('/api', routes);
routes.use(errorHandler);

const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {

  console.log(`connected ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`disconnect ${socket.id}`);
  });
  // ...
});

httpServer.listen(PORT, () => {
  console.log(`Server running ... port = ${PORT}`);
});

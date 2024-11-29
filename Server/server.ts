import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import mainRoutes from './routes/main.routes';
import chatRoute from './routes/chat.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Single CORS middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Routes
app.use('/api', mainRoutes);
app.use('/api/chat', chatRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
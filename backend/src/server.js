// Scheduler: ping semua server setiap 5 menit
import Server from './models/Server.js';
import { checkServerStatus } from './controllers/serverController.js';

const AUTO_PING_INTERVAL = 5 * 60 * 1000; // 5 menit

async function autoPingServers() {
  try {
    const servers = await Server.find();
    for (const server of servers) {
      // Panggil fungsi checkServerStatus secara internal
      // Simulasi request/respons untuk fungsi controller
      await checkServerStatus({ params: { id: server._id } }, { json: () => {}, status: () => ({ json: () => {} }) });
    }
    console.log(`[AutoPing] Selesai ping semua server pada ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error('[AutoPing] Error:', err);
  }
}

setInterval(autoPingServers, AUTO_PING_INTERVAL);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import serverRoutes from './routes/serverRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/servers', serverRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/incidents', incidentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

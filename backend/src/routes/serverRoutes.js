import express from 'express';
import {
  getAllServers,
  getServer,
  createServer,
  updateServer,
  deleteServer,
  checkServerStatus,
  getServerHistory
} from '../controllers/serverController.js';

const router = express.Router();

router.get('/', getAllServers);
router.get('/:id', getServer);
router.post('/', createServer);
router.put('/:id', updateServer);
router.delete('/:id', deleteServer);
router.post('/:id/check', checkServerStatus);
router.get('/:id/history', getServerHistory);

export default router;

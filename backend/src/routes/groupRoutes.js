import express from 'express';
import {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getServersByGroup
} from '../controllers/groupController.js';

const router = express.Router();

router.get('/', getAllGroups);
router.get('/:id', getGroup);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.get('/:id/servers', getServersByGroup);

export default router;
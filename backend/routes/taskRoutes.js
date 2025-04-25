import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', protect, async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id });
  res.json(tasks);
});

router.post('/', protect, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user._id });
  await task.save();
  res.status(201).json(task);
});


router.delete('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  
  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'You can only delete your own tasks' });
  }

  await task.deleteOne();
  res.json({ message: 'Task deleted' });
});

router.put('/:id', protect, async (req, res) => {
    const task = await Task.findById(req.params.id);
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own tasks' });
    }
  

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.completed = req.body.completed ?? task.completed;
  
    await task.save();
    res.json({ message: 'Task updated', task });
  });

export default router;

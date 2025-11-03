import express from 'express'
import { createNote ,deleteNote,getNotes, updateNote } from '../controllers/noteController.js'
import protect from '../middleware/authMiddleware.js'
const router = express.Router()

router.get("/",protect,getNotes)
router.post('/create',protect,createNote)
router.put('/:id',protect,updateNote)
router.delete('/:id',protect,deleteNote)

export default router 
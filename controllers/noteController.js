import Note from '../models/noteModel.js'

// @desc Create a new note 
// @method POST /api/notes/create
// @access Private
export const createNote = async (req,res) => {
    try {
        const note = await Note.create({
            user : req.user._id ,
            title : req.body.title ,
            content : req.body.content 
        })
        if(!note){
            return res.status(500).json({
                message : 'Something went wrong'
            })
        }
        res.status(201).json(note)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message : err.message
        })
    }
}

// @desc Get all notes
// @method GET /api/notes
// @access Private
export const getNotes = async(req,res) => {
    try {
        const notes = await Note.find({
            user : req.user._id  
        })
        res.status(200).json(notes)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message : err.message
        })
    }
}

// @desc Update a note
// @method PUT /api/notes/:id
// @access Private
export const updateNote = async(req,res) =>{
    try {
        const note = await Note.findOneAndUpdate(
            {
                _id : req.params.id ,
                user : req.user._id 
            },{
                title : req.body.title ,
                content : req.body.content 
            },{
                new : true
            }
        )
        if(!note) return res.status(404).json({
            message : 'Not found'
        })
        res.status(200).json(note)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message : err.message
        })
    }
}
// @desc Delete a note 
// @method DELETE /api/notes/:id
// @access Private
export const deleteNote = async(req,res) =>{
    try {
        const note = await Note.findOneAndDelete({
            _id : req.params.id ,
            user : req.user._id
        })
        if(!note) return res.status(404).json({
            message : 'Not found'
        })
        res.status(200).json({
            message : 'Note deleted successfully'
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message : err.message
        })
    }
}
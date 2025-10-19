import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Document'
  },
  content: {
    type: String,
    required: true,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Users who have access to the document
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
},{timestamps: true});

docSchema.pre('save', function(next){
  // if doc is new 
  if(this.isNew || (this.isModified('createdBy') && this.createdBy)){
    // only add if not already present
    if(!this.members.includes(this.createdBy)){
      this.members.push(this.createdBy);
    }
  }
  next();
})

const Doc = mongoose.model('Doc', docSchema);

export default Doc;
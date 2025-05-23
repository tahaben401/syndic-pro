import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 
  role: {
    type: Boolean,
    required: true,
    default: false,
  },
 facture:{
    type: mongoose.Schema.Types.Array,
    ref:"facture",//
    required:false,
 },
 Immeuble:{
    type:String,
    required:true,
 },
 Appartement:{
    type:String,
    required:true,
 }
}, { strict: false });
export default mongoose.model("users", userSchema);
import mongoose from "mongoose";

const factureschema = new mongoose.Schema({
  Numero:{
    type:Number,

    required: true,
  }
    , Date:{
        type:Date,
        required: true,
    },
    Montant:{
        type:Number,
        required: true,
    },
    UserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    Type:{
        type:String,
        required: true,
    },
    Statut:{
        type:String,
        required: true,
        default: "En attente",
    }
}, { strict: false });
export default mongoose.model("facture", factureschema);
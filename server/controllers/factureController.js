import Facture from "../modeles/Facture.js";
import User from "../modeles/User.js";
import mongoose from "mongoose";
export const getAllFac = async (req, res) => {
    try {
       
        const factures = await Facture.find().populate('UserId');
        if (!factures || factures.length === 0) {
            return res.status(404).json({ message: "No factures found" });
        }
        res.status(200).json(factures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const CreateFact = async (req, res) => {
    try {
        const { Numero, Date, Montant, UserId, Type } = req.body;
    
        // Check if the user exists
        const user = await User.findById(UserId);
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
    
        // Create a new facture
        const newFacture = new Facture({
        Numero,
        Date,
        Montant,
        UserId: UserId,
        Type,
        });
    
        await newFacture.save();
    
        // Add the facture to the user's facture array
        user.facture.push(newFacture._id);
        await user.save();
    
        res.status(201).json({ message: "Facture created successfully", facture: newFacture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getFactures = async (req, res) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(403).json({ message: "Not logged in" });
    }

    // Validate if userId is a valid ObjectId string before conversion
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);
    console.log("User ID from session:", objectUserId);

    const factures = await Facture.find({ UserId: objectUserId }).populate('UserId');
    if (!factures || factures.length === 0) {
      return res.status(404).json({ message: "No factures found for this user" });
    } 
    
    res.status(200).json(factures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateFacture = async (req, res) => {
    try {
        const  id  = req.params.id;
        const {  Statut } = req.body;

        const facture = await Facture.findByIdAndUpdate(id, {
 
            
            Statut
        }, { new: true });

        if (!facture) {
            return res.status(404).json({ message: "Facture not found" });
        }

        res.status(200).json({ message: "Facture updated successfully", facture });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
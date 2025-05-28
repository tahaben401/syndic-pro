import Facture from "../modeles/Facture.js";
import User from "../modeles/User.js";
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
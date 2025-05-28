import User from "../modeles/User.js";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import mongoose from 'mongoose';
import session from "express-session";  
import { Session } from "inspector/promises";
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
 
   port: 587,
   auth: {
     user: 'aymanemwa@gmail.com',
     pass: 'fvkf xbwt tsrs tuww', // Use Gmail App Password
   },
 });
export const Create = async (req, res) => {
  try {
    const { FirstName, LastName, email, password, Appartement, Immeuble } = req.body;
    const userFind = await User.findOne({ email: email });

    if (userFind) {
      return res.status(400).json({ message: "Already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Temporarily save the user with isVerified = false
    const newUser = new User({
      email,
      FirstName,
      LastName,
      Immeuble,
      Appartement,
      password: hashedPass,
      role: false,
      createdAt: new Date(),
      isVerified: false,
      verificationToken
    });
console.log("Token:", verificationToken);

    await newUser.save();

    const verifyURL = `http://localhost:3000/api/verify/${verificationToken}`;

    await transporter.sendMail({
      from: '"My App" <yourgmail@gmail.com>',
      to: email,
      subject: "Verify your account",
      html: `<p>Hello ${FirstName},</p><p>Click the link below to verify your email:</p><a href="${verifyURL}">${verifyURL}</a>`,
    });

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });

  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
   
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).send("Email verified. You can now log in.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (!userFind) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userFind.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    if (!userFind.isVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const idString = userFind._id.toString();

    req.session.userId = idString;
    
    req.session.isLoggedIn = true;
    req.session.email = userFind.email;
    req.session.role = userFind.role;

    const userWithoutPassword = userFind.toObject();
    delete userWithoutPassword.password;

    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session save error" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        role: userFind.role === true ? "admin" : "user"
      });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getImmeublleApp= async (req, res) => {
 try {
  console.log('Session:', req.session);

    const userId = req.session.userId;
    console.log("User ID from session:", userId);
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const objectUserId = new mongoose.Types.ObjectId(`${userId}`);
console.log("User ID from session:", objectUserId);
    console.log("User ID from session:", userId);
    
    const user = await User.findById(userId).select("Immeuble Appartement");
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const getAllImmeubleApp = async (req, res) => {
  try {
    // Find all users and select only Immeuble and Appartement fields
    const users = await User.find({}).select('Immeuble Appartement');
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Transform the data into an array of objects with the required structure
    const properties = users.map(user => ({
    
      Immeuble: user.Immeuble,
      Appartement: user.Appartement
    }));

    res.status(200).json(properties);
  }
  catch (error) {
    res.status(500).json({ 
      message: "Error fetching properties",
      error: error.message 
    });
  }
}
  export const FetchUser = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated1" });
    }

    const user = await User.findById(userId).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  export const getResidents = async(req,res)=>{
    try {
    const users = await User.find({role:false}, 'FirstName LastName Immeuble Appartement email');
    res.status(200).json({
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching residents",
      error: error.message
    });
  }
  }

export const UpdateUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { email, password } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated2" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();
    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    return res.status(200).json({
      message: "User updated successfully",
      user: userToReturn
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

  
  export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "User  was deleted successfully",
      deletedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "There was an Error in  deleting user",
      error: error.message 
    });
  }
};
export const getData = async(req,res)=>{
    try{
      const counts = await User.aggregate([
      {
        $group: {
          _id: "$Immeuble",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    const immeubles = await User.distinct("Immeuble");
    res.status(200).json({
     
      chartData:{
        counts,
        immeubles
      }
    }
    )
    }
    catch(error){
       res.status(500).json({
      success: false,
      message: "Couldn't get Immeubles statistics",
      error: error.message
    });
    }
  }


  export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  })};
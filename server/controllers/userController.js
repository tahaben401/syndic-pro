import User from "../modeles/User.js"
import bcrypt from 'bcryptjs'
export const Create= async(req,res)=>{
 try{
   const {FirstName, LastName,email,password,Appartement,Immeuble} = req.body;
   const userFind=await User.findOne({email:email});
   if(userFind){
    return res.status(400).json({message: "Already exists"});
   }
    const hashedPass=await bcrypt.hash(password,10);
    const newUser = new User({
        email,
        FirstName,
          LastName,
       Immeuble:Immeuble,
       Appartement:Appartement,
        
          password: hashedPass,
       
          role: false,
          createdAt: new Date(),
     
     
      });
  
      const savedData = await newUser.save();
      res.status(200).json(savedData);
    } catch (error) {
      res.status(500).json({ Message: error.message });
    }
  };
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userFind = await User.findOne({ email, password });
  
      if (userFind) {
        console.log("Welcome Back");
        return res.status(200).json(userFind);
      }
  
      // User not found
      return res.status(404).json({ message: "Invalid email or password" });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
<<<<<<< HEAD
  //Dashboard Part :
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
=======
  export const FetchUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const userFind = await User.findOne({_id: id });
  
      if (userFind) {
        console.log("User found");
        return res.status(200).json(userFind);
      }
      
      
      return res.status(404).json({ message: "This id is not valid" });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
>>>>>>> 718d53ea0792b15a69ee8aa717d001e9143ddeea
  export const getResidents = async(req,res)=>{
    try {
    const users = await User.find({}, 'FirstName LastName Immeuble Appartement email');
    res.status(200).json({
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching residents",
      error: error.message
<<<<<<< HEAD
    });
  }
  }
=======
    });
  }
  }
export const UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    user.email = email;
    
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    
    const updatedUser = await user.save();

    
    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    return res.status(200).json({
      message: "User updated successfully",
      user: userToReturn
    });

  } catch (error) {
    console.error("Update error:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    
    return res.status(500).json({ 
      message: "Error updating user",
      error: error.message 
    });
  }
};
>>>>>>> 718d53ea0792b15a69ee8aa717d001e9143ddeea
  
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


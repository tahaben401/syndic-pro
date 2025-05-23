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
  



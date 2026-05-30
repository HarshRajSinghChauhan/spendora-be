import authService from './auth.service.js';

const register = async (req,res) =>{
    try{
        const result = await authService.register(req.body);
        res.status(201).json({ 
            success: true,
            message: "User registered successfully",
            data: result
         });
    }catch(err){
        res.status(400).json({ 
            success: false,
            message: err.message
         });
    }
}

const login = async (req,res) =>{
    try{
        const result = await authService.login(req.body);
        res.status(200).json({ 
            success: true,
            message: "User logged in successfully",
            data: result
         });
    }catch(err){
        res.status(400).json({ 
            success: false,
            message: err.message
         });
    }
}

const logout = async(req,res) =>{
    try{
        const result = await authService.logout({...req.body, id: req.user.id});
        res.status(200).json({ 
            success: true,
            message: "User logged out successfully",
            data: result
         });
    }catch(err){
        res.status(400).json({ 
            success: false,
            message: err.message
         });
    }
}

const refreshToken = async (req, res) => {
   try {
      const result = await authService.refreshToken(req.body);
      res.status(200).json({
         success: true,
         message: "Access token refreshed successfully",
         data: result
      });

   } catch (err) {

      res.status(401).json({
         success: false,
         message: err.message
      });

   }
};

const forgotPassword = async(req,res) =>{}

const resetPassword = async(req,res) =>{}
export default {
    register, login, logout, forgotPassword, resetPassword, refreshToken
}
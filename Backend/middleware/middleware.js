import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import cloudinary from "../utils/cloudinary/cloudinary.js";

export const verifyToken = (req, res, next) => {
    // Extract token from either cookie or Authorization header
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) return next(errorHandler(401, 'You are not authenticated'));

    // Verify the token using JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Token is not valid'));

        req.user = user;
        next();
    });
};

// Middleware to verify if the user is an admin
export const verifyAdmin = (req, res, next) => {
    const { role } = req.user;

    if (role !== 'admin') {
        return next(errorHandler(403, 'Permission denied. Only admin users can access this resource.'));
    }

    next();
};

export const cloudinaryMiddleware = async(req,res,next) =>{
    try {
        if (req.body.profilePicture) {
            const profilePictureResult = await cloudinary.uploader.upload(req.body.profilePicture, {
                folder: "users",
                allowed_formats: ["png", "jpg", "jpeg", "avif"]
            });
    
            req.body.profilePicture = profilePictureResult.secure_url;
        }

        if (req.body.invoiceFile){
            const invoiceFileResult = await cloudinary.uploader.upload(req.body.invoiceFile, {
                folder: "invoices",
                allowed_formats: ["pdf"]
            });

            req.body.invoiceFile = invoiceFileResult.secure_url;
        }
        
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error uploading profile picture. Check the image format.' });
    }
}
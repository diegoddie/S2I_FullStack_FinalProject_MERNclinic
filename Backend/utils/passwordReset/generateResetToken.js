import jwt from 'jsonwebtoken'

export const generateResetToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.RESET_SECRET, { expiresIn: '1h' });
};
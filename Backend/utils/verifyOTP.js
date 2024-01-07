import speakeasy from 'speakeasy'

const verifyOTP = (user, token) => {
    return speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
    });
};

export default verifyOTP
const generateTokenPayload = (user, role) => {
    const tokenPayload = { id: user._id };

    if (role) {
        tokenPayload.role = role;
    }

    return tokenPayload;
};

export default generateTokenPayload
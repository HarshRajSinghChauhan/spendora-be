import authRespository from "./auth.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    generateAccessToken,
    generateRefreshToken
} from "./auth.token.js";
const saltRounds = 12;

const register = async ({ name, email, password }) => {
    const existingUser = await authRespository.findUserByEmail(email);

    if (existingUser) {
        throw new Error("User already exists with this email, please log in.");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await authRespository.create({ name, email, password: hashedPassword });
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
    };
}

const login = async ({ email, password }) => {

    const user = await authRespository.findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    if (user.isBlocked) {
        throw new Error("Account is blocked");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password.");
    }

    const payload = {
        id: user.id,
        role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);
    await authRespository.updateRefreshToken(
        user.id,
        hashedRefreshToken
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

const refreshToken = async ({ refreshToken }) => {

    if (!refreshToken) {
        throw new Error("Refresh token required");
    }

    let decoded;

    try {

        decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

    } catch (err) {

        throw new Error("Invalid or expired refresh token");
    }

    const user = await authRespository.findUserById(decoded.id);

    if (!user) {
        throw new Error("User not found");
    }

    const isRefreshTokenMatch =
        await bcrypt.compare(
            refreshToken,
            user.refreshToken
        );

    if (!isRefreshTokenMatch) {
        throw new Error("Refresh token mismatch");
    }

    const payload = {
        id: user.id,
        role: user.role
    };

    const newAccessToken = generateAccessToken(payload);

    return {
        accessToken: newAccessToken
    };
};

const logout = async (data) => {
    await authRespository.clearRefreshToken(data);
    return {
        message: "Logged out successfully"
    };
}
export default {
    register, login, logout, refreshToken
}
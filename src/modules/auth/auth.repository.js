import prisma from "../../config/prisma.js";

const create = async ({ name, email, password }) => {
    return prisma.user.create({
        data: {
            name,
            email,
            password
        },
    });
};

const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email,
            deletedAt: null
        }
    });
};
const updateRefreshToken = async (userId, refreshToken) => {
    return prisma.user.update({
        where: {
            id: userId
        },
        data: {
            refreshToken
        }
    });
};

const clearRefreshToken = async ({ id }) => {
    return prisma.user.update({
        where: {
            id
        },
        data: {
            refreshToken: null
        }
    });
};

const findUserById = async (id) => {
    return prisma.user.findUnique({
        where: { id }
    });
};

export default {
    create, findUserByEmail, updateRefreshToken, clearRefreshToken, findUserById
}
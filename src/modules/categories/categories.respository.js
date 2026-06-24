import prisma from "../../config/prisma.js";

export const findByNameandType = async ({ name, type, createdById }) => {
    return prisma.category.findFirst({
        where: {
            name,
            type,
            createdById
        }
    });
}

export const createCategory = async ({ name, type, createdById }) => {
    return prisma.category.create({
        data: {
            name,
            type,
            createdById
        }
    })

}

export const getAllCategories = async ({ userId, type, page = 1, limit = 10 }) => {
    const where = {
        isDisabled: false,

        OR: [
            { isGlobal: true },
            { createdById: userId }
        ]
    };

    const skip = (page - 1) * limit;
    if (type) {
        where.type = type;
    }

    const [category, totalRecords] = await Promise.all([
        prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                name: "asc"
            }
        }),

        prisma.category.count({
            where
        })
    ]);

    return {
        category,
        totalRecords
    }

}


export default{
    findByNameandType,
    createCategory,
    getAllCategories
}
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
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {
        isDisabled: false,

        OR: [
            { isGlobal: true },
            { createdById: userId }
        ]
    };

    if (type) {
        where.type = type;
    }

    const [category, totalRecords] = await Promise.all([
        prisma.category.findMany({
            where,
            skip,
            take: limitNum,
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
    };
};

export const getCategoryById = async ({ id, userId }) => {
    const category = await prisma.category.findUnique({
        where: { id }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    if (category.createdById !== userId) {
        throw new Error("Unauthorized");
    }
    return category;
}

export const deleteCategoryById = async ({id, userId}) => {
    const category = await prisma.category.findFirst({
        where: {
            id,
            createdById: userId,
            isDisabled: false
        }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    await prisma.category.update({
        where: {
            id
        },
        data: {
            isDisabled: true
        }
    });

    return category;
}

export const updateCategoryById = async ({ id, userId, name, type }) => {
    const category = await prisma.category.findFirst({
        where: {
            id,
            createdById: userId,
            isDisabled: false
        }
    });

    if (!category) {
        throw new Error("Category not found or unauthorized");
    }

    const data = {};
    if (name) data.name = name;
    if (type) data.type = type;

    return await prisma.category.update({
        where: { id },
        data
    });
};

export default {
    findByNameandType,
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategoryById,
    updateCategoryById
};
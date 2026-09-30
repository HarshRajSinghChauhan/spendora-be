import categoriesRepository from "./categories.repository.js";
export const createCategory = async (data) => {
    const existingCategory = await categoriesRepository.findByNameandType(data);

    if(existingCategory){
        throw new Error(`Category ${data.name} already exists for ${data.type}`)
    }

    const category = await categoriesRepository.createCategory(data);
    return {
        id: category.id,
        category_name: category.name,
        type: category.type,
        is_global: category.isGlobal
    }
};

export const getAllCategories = async (data) => {

    const result = await categoriesRepository.getAllCategories(data);

    return {
        categories: result.category.map((category) => ({
            id: category.id,
            name: category.name,
            type: category.type,
            isGlobal: category.isGlobal
        })),

        pagination: {
            page: data.page,
            limit: data.limit,
            totalRecords: result.totalRecords,
            totalPages: Math.ceil(
                result.totalRecords / data.limit
            )
        }
    };
};

const getCategoryById = async (data) => {
    const result = await categoriesRepository.getCategoryById(data);
    return {
        id: result.id,
        name: result.name,
        type: result.type,
        isGlobal: result.isGlobal
    }
}

export const updateCategoryById = async (data) => {
    if (data.name && data.type) {
        const existing = await categoriesRepository.findByNameandType({
            name: data.name,
            type: data.type,
            createdById: data.userId
        });

        if (existing && existing.id !== data.id) {
            throw new Error(`Category ${data.name} already exists for ${data.type}`);
        }
    }

    const result = await categoriesRepository.updateCategoryById(data);
    return {
        id: result.id,
        name: result.name,
        type: result.type,
        isGlobal: result.isGlobal
    };
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategoryById,
    updateCategoryById
};
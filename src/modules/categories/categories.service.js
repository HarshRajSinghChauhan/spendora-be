import categoriesRespository from "./categories.respository.js";
export const createCategory = async (data) => {
    const existingCategory = await categoriesRespository.findByNameandType(data);

    if(existingCategory){
        throw new Error(`Category ${data.name} already exists for ${data.type}`)
    }

    const category = await categoriesRespository.createCategory(data);
    return {
        id: category.id,
        category_name: category.name,
        type: category.type,
        is_global: category.isGlobal
    }
};

export const getAllCategories = async (data) => {

    const result = await categoriesRespository.getAllCategories(data);

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
    const result = await categoriesRespository.getCategoryById(data);
    return {
        id: result.id,
        name: result.name,
        type: result.type,
        isGlobal: result.isGlobal
    }
}

const deleteCategoryById = async (id) => {
    const result = await categoriesRespository.deleteCategoryById(id);
    return {
        id: result.id,
        name: result.name,
        type: result.type,
        isGlobal: result.isGlobal
    }
}

export default{
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategoryById
}
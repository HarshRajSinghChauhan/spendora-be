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

    const result =
        await categoriesRepository.getAllCategories(data);

    return {
        categories: result.categories.map((category) => ({
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

export default{
    createCategory,
    getAllCategories
}
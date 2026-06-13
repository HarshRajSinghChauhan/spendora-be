import categoriesRespository from "./categories.respository";
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

export const getAllCategories = async ({type}) =>{
    if(type){
    const categories = await categoriesRespository.getAllCategories({type});
    }
    return categories.map((category) =>({
        id: category.id,
        name: category.name,
        type: category.type,
        is_global: category.isGlobal
    }))

}
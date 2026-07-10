import categoriesService from "./categories.service.js";

const createCategory = async (req, res) => {
    try {
        const result = await categoriesService.createCategory({ ...req.body, createdById: req.user.id });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to create category",
            error: err.message
        });
    }
};

const getAllCategories = async (req, res) => {
    try{
        const result = await categoriesService.getAllCategories(req.query);
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result
        })
    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const getCategoryById = async (req, res) =>{
    try{
        const result = await categoriesService.getCategoryById({ id: req.params.id, userId: req.user.id });
        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: result
        })

    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

const deleteCategoryById = async (req, res) =>{
    try{
        const result = await categoriesService.deleteCategoryById({ id: req.params.id, userId: req.user.id });
        res.status(200).json({
            success: true,
            message: "category deleted successfully",
            data: result
        })
    }catch(err){
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export default{
    createCategory,
    getAllCategories,
    deleteCategoryById,
    getCategoryById
}
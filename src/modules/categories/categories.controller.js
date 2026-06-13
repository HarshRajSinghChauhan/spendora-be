import categoriesService from "./categories.service";

export const createCategory = async (req, res) => {
    try {
        const result = await categoriesService.createCategory(req.body);
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

export const getAllCategories = async (req, res) => {
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
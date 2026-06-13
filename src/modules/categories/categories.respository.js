import prisma from "../../config/prisma.js";

const findByNameandType = async ({name, type, createdById}) =>{
    return prisma.category.findFirst({
      where: {
         name,
         type,
         createdById
      }
   });
}

const createCategory = async ({name, type, createdById}) =>{
    return prisma.category.create({
        data:{
            name,
            type,
            createdById
        }
    })

}

const getAllCategories = async ({type}) => {
    if(type){
        
    }
}
export default {
    createCategory,
    findByNameandType,
}
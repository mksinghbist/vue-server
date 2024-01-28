// ProductDto.ts
const mongoose = require('mongoose');
const productsInfo = require('../../database/schema/products');
const validateProductDto = (data) => {
    try {
    console.log(data);
    const { userId, productTitle, productImgUrl,productPrice, productQty, productMaxQty, productMinQty, productSoldQty, productDescription, productStatus,productType } = data;
    if (!userId ||
        typeof userId !== 'string' ||
        !productTitle ||
        typeof productTitle !== 'string' ||
        !productImgUrl ||
        typeof productImgUrl !== 'string') {
        return null;
    }
    // Additional validation logic can be added based on your requirements
    const newProduct = new productsInfo({
        userId: new mongoose.Types.ObjectId(userId.trim()),
        productTitle: productTitle.trim(),
        productImgUrl: productImgUrl.trim(),
        productType: productType,
        productPrice:  typeof productPrice === 'string' ? productPrice : '0',
        productQty: typeof productQty === 'number' ? productQty : 0,
        productMaxQty: typeof productMaxQty === 'number' ? productMaxQty : 0,
        productMinQty: typeof productMinQty === 'number' ? productMinQty : 0,
        productSoldQty: typeof productSoldQty === 'number' ? productSoldQty : 0,
        productDescription: typeof productDescription === 'string' ? productDescription.trim() : '',
        productStatus: typeof productStatus === 'boolean' ? productStatus : false,
    })
    return newProduct;
} catch (error){
    console.log(error);
    return null;
}
};
module.exports = validateProductDto;
import { ProductService, SessionService } from "../repositories/index.js";
import validationUtils from "../utils/validate.js";

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getProducts();
    return res.status(200).json({ message: "Existing products in data base. ", products });
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error getting products." });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProductById(pid);

    if (!product) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      return res.status(200).json({ message: "Product found. ", product });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error getting a product." });
  }
};
export const createProduct = async (req, res) => {
  try {
    const product = req.body;
    if (!validationUtils.validateProduct(product)) {
      return res.status(400).json({
        message:
          "Error - Please fill all required product fields (title, description, code, price, status, stock and category).",
      });
    } else {
      if (!validationUtils.validatePrice(product.price)) {
        return res.status(400).json({ message: "Error - Invalid price range." });
      }
      const checkProduct = await ProductService.getProductByCode(product.code);
      if (!checkProduct) {
        if (req.user.user.role.toLowerCase() !== "admin") {
          const findUser = await SessionService.findUserById(req.user.user.id);
          console.log(findUser);
          const newProduct = { ...product, owner: req.user.user.id };
          const productBody = await ProductService.createProduct(newProduct);
          return res
          .status(200)
          .json({ message: "Product created. ", productBody });
        } else {
          const productBody = await ProductService.createProduct(product);
          return res
            .status(200)
            .json({ message: "Product created. ", productBody });
        }
      } else {
        return res.status(400).json({
          message:
            "Error - Product already exists. Please update product if you want to modify its values.",
        });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error creating a product." });
  }
};
export const updateProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const productBody = req.body;

    if (!validationUtils.validateProductBody(productBody)) {
      return res.status(400).json({
        message:
          "Error - Only title, description, code, price, status, stock and category can be modified.",
      });
    } else {
      const updatedProduct = await ProductService.updateProductById(
        pid,
        productBody
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Error - Product not found." });
      }
      return res
        .status(200)
        .json({ message: "Product Updated. ", updatedProduct });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error updating a product." });
  }
};
export const deleteProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductService.getProductById(pid);
    if (!product) {
      return res.status(404).json({ message: "Error - Product not found." });
    } else {
      const findUser = await SessionService.findUserById(req.user.user.id);
      if (req.user.user.role.toLowerCase() === "premium") {
        if (product.owner !== String(findUser._id)) {
          return res
            .status(403)
            .json({
              message:
                "Error - Premium users cannot delete products created by the admin.",
            });
        } else {
          const deletedProduct = await ProductService.deleteProductById(pid);
          return res.status(200).json({
            message: "Product deleted",
            deletedProduct
          });
        }
      }
      const deletedProduct = await ProductService.deleteProductById(pid);
      return res.status(200).json({
        message: "Product deleted.",
        deletedProduct
      });
    }
  } catch (err) {
    req.logger.error(err);
    return res
      .status(500)
      .json({ message: "There was an error deleting a product." });
  }
};
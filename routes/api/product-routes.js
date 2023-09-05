const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const productsData = await Product.findAll({
      include: [
        { model: Category }, // Include associated Category
        { model: Tag, through: ProductTag }, // Include associated Tags
      ],
    });
    res.status(200).json(productsData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET one product by its `id` with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category }, // Include associated Category
        { model: Tag, through: ProductTag }, // Include associated Tags
      ],
    });

    if (!productData) {
      res.status(404).json({ message: 'Product not found with this id' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    // If there are tagIds in the request body, create ProductTag associations
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// PUT update a product by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // If there are tagIds in the request body, update ProductTag associations
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
      await ProductTag.destroy({
        where: {
          product_id: req.params.id,
        },
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }

    if (!updatedProduct[0]) {
      res.status(404).json({ message: 'Product not found with this id' });
      return;
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE a product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found with this id' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;

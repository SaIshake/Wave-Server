const createError = require("../middleware/error");
const { verifyToken, VerifyUser, verifyTokenAndAdmin } = require("../middleware/verifyToken");
const Cart = require("../models/Cart");


const router = require("express").Router();

//CREATE

router.post('/add', verifyToken, async (req, res, next) => {
  const { productId, title, img, price, size, color, quantity, userId } = req.body;

  try {
    // Check if cart item with userId and productId exists
    let cartItem = new Cart({
        userId,
        productId,
        color,
        size,
        title,
        img,
        price,
        quantity
      });

      await cartItem.save();


    res.status(201).json(cartItem);
  } catch (err) {
    next(err)
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  const id = req.params.id
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      req.body,
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete('/delete/:id', verifyToken, async (req, res, next) => {
  const cartItemId = req.params.id;

  try {
    // Find and delete the cart item with the specified userId and productId
    const cartItem = await Cart.findByIdAndDelete(cartItemId);
    res.status(200).json({ message: 'Cart item deleted successfully'});
  } catch (err) {
    next(err)
  }
});

router.delete('/deleteAll', verifyToken, async (req, res, next) => {
  const userId = req.user.id;

  try {

    const deleteResult = await Cart.deleteMany({ userId });
    res.status(200).json({ message: 'All cart items deleted successfully' });
  } catch (err) {
    next(err)
  }
});


//GET USER CART
router.get('/find', verifyToken, async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Find all cart items with the specified userId
    const cartItems = await Cart.find({ userId })

    if (cartItems.length === 0) {
      return next(createError(404, "No Cart Items found for this user"));
    }
    res.status(200).json(cartItems);
  } catch (err) {
    next(err)
  }
});


module.exports = router;

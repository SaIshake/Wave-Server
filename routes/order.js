const { verify } = require("jsonwebtoken");
const { verifyToken, verifyTokenAndAdmin, VerifyUser } = require("../middleware/verifyToken");
const Order = require("../models/Order");


const router = require("express").Router();

//GET USER ORDERS
router.get("/get-all", verifyToken, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    next(err)
  }
});


// Add Order
router.post("/", verifyToken, async (req, res,next) => {
  try {
    const {products, amount, firstName ,secondName, wilaya, address, phoneNumber} = req.body;
    const data = {
      products, amount, firstName ,secondName, wilaya, address, phoneNumber,
      userId: req.user.id
    }
    const order = new Order(data);
    await order.save();
    res.status(201).json({ message: "Order added successfully", order });
  } catch (error) {
    next(error)
  }
});

// Update Order
router.put("/update/:orderId", verifyToken, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const updatedData = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this order" });
    }

    if (order.status !== "pending") {
      return res.status(403).json({ message: "Cannot update order, status is not pending" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedData, { new: true });

    res.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});





// Delete Order
router.delete("/delete/:orderId", verifyToken, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this order" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(403).json({ message: "Cannot delete order, status is not pending" });
    }

    await order.remove();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/remove/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          status: "confirmed",
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

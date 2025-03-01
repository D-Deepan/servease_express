const Orders = require('../models/ordersmodels');


exports.placeorder = async (req, res) => {
    try {
      const { foodId, roomNo, quantity } = req.body;
      const order = new Orders({ foodId, roomNo, quantity });
      await order.save();
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      res.status(500).json({ error: "Failed to place order" });
    }
  };

  exports.deleteorder = async (req, res) => {
    try {
      const { orderid } = req.body;
      if (!orderid) {
        return res.status(400).json({ error: "Order ID is required" });
      }
      const deletedOrder = await Orders.findByIdAndDelete(orderid);
      if (!deletedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  };

exports.fetchorders = async (req, res) => {
    try {
      const orders = await Orders.find({ status: { $in: ['queued', 'preparing'] } }).populate('foodId','name');
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

exports.updatestatus = async (req, res) => {
    try {
      const { orderid } = req.body;
      const { status } = req.body; 
      const updatedOrder = await Orders.findByIdAndUpdate( orderid, { status }, { new: true });
      res.json({ message: "Order status updated", updatedOrder });
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  }

  exports.servedorders = async (req, res) => {
    try {
      const roomNo = req.user.roomNo;
  
      const orders = await Orders.find({ roomNo: roomNo, status: 'served' })
        .populate('foodId', 'name'); // Populate the 'foodId' field with the 'name' from the Food model
  
      const ordersWithNames = orders.map((order) => ({
        _id: order._id,
        name: order.foodId.name, 
        status: order.status,
        orderedAt: order.orderedAt
      }));
      res.status(200).json({
        success: true,
        message: orders.length > 0 ? 'Served orders fetched successfully' : 'No served orders found',
        servedorders: ordersWithNames,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Error fetching served orders',
        error: error.message,
      });
    }
  };
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");


router.get('/:userId',cartController.getAllItem)
router.post("/:userId", cartController.addItemToCart);
router.get("/:userId", cartController.getCart);
router.patch("/:userId", cartController.deleteItem);
router.delete("/:userId", cartController.removeItem);

module.exports = router;

const {Router} = require("express");
const BorrowingController = require("../controllers/BorrowingController");

const router = Router();
const borrowingController = new BorrowingController();

router.post('/', borrowingController.postBorrowing);
router.put('/:id/return', borrowingController.putBorrowing);

module.exports = router;

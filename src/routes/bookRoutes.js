const {Router} = require("express");
const BookController = require("../controllers/BookController");

const router = Router();
const bookController = new BookController();

router.get('/', bookController.getBooks);

module.exports = router;

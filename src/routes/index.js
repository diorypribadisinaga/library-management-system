const {Router} = require("express");

const router = Router();

const booksRoutes = require('./bookRoutes');
const memberRoutes = require('./memberRoutes');
const borrowingRoutes = require('./borrowingRoutes');

router.use('/books', booksRoutes);
router.use('/members', memberRoutes);
router.use('/borrowings',borrowingRoutes);

module.exports = router;

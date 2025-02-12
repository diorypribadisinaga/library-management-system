const {Router} = require("express");
const MemberController = require("../controllers/MemberController");

const router = Router();
const memberController = new MemberController();

router.post('/', memberController.postMember);
router.get('/:id/borrowings',memberController.getMemberBorrowingsHistory);

module.exports = router;

const { createUser, getUserByUserId, getUsers, updateUsers, deleteUser } = require('./userController');
const router = require('express').Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserByUserId);
router.patch('/:id', updateUsers);
router.delete("/:id", deleteUser);
module.exports = router;
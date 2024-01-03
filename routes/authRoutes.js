const express = require('express');
const { createUser, loginUserCtrl, getallUser, getAUser, deleteAUser, updateAUser, blockUser, UnblockUser, handleRefreshToken, logOut } = require('../controller/userCtrl');
const {autheMiddleware , isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/all-users',getallUser);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logOut)

router.get('/:id',autheMiddleware,isAdmin,getAUser);
router.delete('/:id',deleteAUser);
router.put('/edit-users', autheMiddleware ,updateAUser)
router.put('/block-users/:id', autheMiddleware, isAdmin ,blockUser)
router.put('/unblock-users/:id', autheMiddleware, isAdmin ,UnblockUser)
module.exports = router;    
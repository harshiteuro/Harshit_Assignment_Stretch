const express=require('express');
const {check}=require('express-validator');

const usersControllers=require('../controllers/users-controllers');
const fileUpload=require('../middleware/file-upload');

const router=express.Router();

router.post('/',fileUpload.single('image'),usersControllers.getUsers)  
router.get('/:id/delete_profile',usersControllers.deleteProfile)
router.get('/:id/view_profile',usersControllers.getUserByToken)                           //Test@test.com==test@test.com--normalization
router.post('/signup',fileUpload.single('image'),[check('name').not().isEmpty(),check('email').normalizeEmail().isEmail(),check('password').isLength({min:6})],usersControllers.signup)
router.post('/login',usersControllers.login)
router.post('/update',fileUpload.single('image'),usersControllers.update)

module.exports=router;

const generateToken = require('../config/jwtToken');
const User = require('../models/userModel')
const asyncHandler = require("express-async-handler");
const validateMongodbId = require('../utils/validateMongodbId');
const generateRefreshToken = require('../config/refreshToken')
const jwt = require('jsonwebtoken')
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email })
    if (!findUser) {
        //Create a new User
        const newUser = await User.create(req.body)
        res.json(newUser);
    } else {
        //User Already Exist
        throw new Error("User Already Exits")
    }
})

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    //check if user exists or not
    const findUser = await User.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            {
                new: true
            },
        );
        res.cookie('refreshToken', refreshToken,
            {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            }
        )
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser._id),
        })
    } else {
        throw new Error("Invalid Credentials")
    }
}
)

// Handle refresh Token
const handleRefreshToken = asyncHandler(async (req,res) => { 
    const cookie = req.cookies
    if (!cookie.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken});
    if (!user)  throw new Error('No Refresh Token present in db or ot matched')
    jwt.verify(
    refreshToken,
    process.env.JWT_SECRET, (err, decode) => { 
        if(err || user.id !== decode.id) {
            throw new Error('There is something wrong with refresh refreshToken')
        }
        const accessToken = generateToken(user._id)
        res.json({accessToken})
    }
)
 })

// Logout functionally 

const logOut= asyncHandler(async (req,res) => { 
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookie')
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if(!user) {
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:true,
        })
        return res.sendStatus(204)    // forbidden
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken:"",
    })
    res.clearCookie("refreshToken", {
        httpOnly:true,
        secure:true,
    })
    res.sendStatus(204) // forbidden
})

//Update A User

const updateAUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongodbId(_id)
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            }, {
            new: true
        })
        res.json(updateUser)
    } catch (error) {
        throw new Error(er)
    }
})

// Get All User

const getallUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    console.log(cookie);

    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

// Get A User

const getAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const getAUser = await User.findById(id)
        res.json(getAUser)
    } catch (error) {
        throw new Error(error)
    }
})


// Delete A User

const deleteAUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const deleteAUser = await User.findByIdAndDelete(id)
        res.json(deleteAUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Block User 
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            },
        )
        res.json({
            message: "User Blocked "
        })
    } catch (error) {
        throw new Error(error)
    }
})


const UnblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodbId(id)
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            },
        )
        res.json({
            message: "User UnBlocked "
        })
    } catch (error) {
        throw new Error(error)
    }
})



module.exports = {
    createUser
    , loginUserCtrl
    , getallUser
    , getAUser
    , deleteAUser
    , updateAUser
    , UnblockUser
    , blockUser
    , handleRefreshToken
    , logOut
};
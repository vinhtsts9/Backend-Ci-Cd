const { newUserService } = require("../services/user.service")

class UserController {
    newUser = async (req, res, next) => {
        const response = await newUserService({
            email: req.body.email
        })
        new SuccessReponse(response).send(res)
    }

    emailRegister = async () => {

    }
}

module.exports = new UserController()
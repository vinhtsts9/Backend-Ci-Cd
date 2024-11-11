const { SuccessResponse } = require("../core/success.response")

const dataProfiles = [{
    usr_id: 1,
    usr_name: 'Cr7',
    usr_avt: 'img.com/user/1'
},
{
    usr_id: 2,
    usr_name: 'Halaand',
    usr_avt: 'img.com/user/2'
},
{
    usr_id: 3,
    usr_name: 'Salad',
    usr_avt: 'img.com/user/3'
}]
class ProfileController {
    
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'view all profile',
            metadata: [
                dataProfiles
            ]
        }).send(res)
    }
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'view profile',
            metadata: [
                {
                    usr_id: 3,
                    usr_name: 'Salad',
                    usr_avt: 'img.com/user/3'
                }
            ]
        }).send(res)
    }


}
module.exports = new ProfileController()
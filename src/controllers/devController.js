const axios = require('axios');
const Dev = require('../models/dev');


module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggerUser = await Dev.findById(user).catch(e => console.log(e));

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                {_id: { $nin:loggerUser.likes } },
                {_id: { $nin:loggerUser.dislikes } },
            ],
        }).catch(e => console.log(e))

        return res.json(users)
    },

    async store(req, res) {
        const { username } = req.body;        
        
        const userExists = await Dev.findOne({user: username}).catch(e => console.log(e));

        if(userExists){
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar: avatar_url,
            //tem que usar o mesmo nome que foi definido para atribuir o valor automaticamente ou alterar como esta em avatar_url
        }).catch(e => console.log(e));

        return res.json(dev);
    }
};
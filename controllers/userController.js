const ApiError = require('../error/apiErrors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/model')
const db = require('../db')

const generateJwt = (id, email) => {
    return jwt.sign(
        {id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword})
        const token = generateJwt(user.id, user.email)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.email)
        return res.json({token})
    }

    async check(req, res) {
    }
    async getUsers(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }
    async getUser(req, res) {
        const {id} = req.params
        const user = await User.findByPk(id)
        return res.json(user)
    }
    async updateUser(req, res) {
        const user = req.body
        const updatedUser = await  User.update( {
                user
            },
            {
                where: { id: req.body.id }
            } )
        return res.json(updatedUser)
    }
    async deleteUser(req, res) {
        const user = await User.destroy({
            where: {
                id: req.params.id
            }})
        return res.json(user)
    }

}

module.exports = new UserController()
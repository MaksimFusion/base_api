const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

router.get('/users', userController.getUsers)
router.get('/:id', userController.getUser)
router.put('/update', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router
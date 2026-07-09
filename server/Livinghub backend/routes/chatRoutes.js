const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const chatController = require('../controllers/chatController');

const router = express.Router();

const startConversationValidation = [
  body('unitId').isMongoId().withMessage('Invalid unit ID'),
  validate
];

router.use(auth);

router.post('/start', startConversationValidation, chatController.startOrGetConversation);
router.get('/', chatController.getMyConversations);
router.get('/:conversationId/messages', chatController.getMessages);

module.exports = router;

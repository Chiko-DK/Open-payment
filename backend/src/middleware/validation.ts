import { body } from "express-validator";

export const validatePaymentRequest = [
  body('senderWalletAddress')
    .isURL()
    .withMessage('Invalid sender wallet address'),
  body('receiverWalletAddress')
    .isURL()
    .withMessage('Invalid receiver wallet address'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be numeric')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0')
];

export const validatePaymentCompletion = [
  body('senderWalletAddress').isURL(),
  body('quoteId').notEmpty(),
  body('continueToken').notEmpty(),
  body('continueUri').isURL(),
  body('interactRef').notEmpty()
];

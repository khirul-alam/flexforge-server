const stripe = require('../../config/stripe');
const { getDB } = require('../../config/db');
const { successResponse } = require('../../utils/apiResponse');

async function createPaymentIntent(req, res, next) {
  try {
    const { price } = req.body;
    const amount = Math.round(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
}

async function saveTransaction(req, res, next) {
  try {
    const db = getDB();
    const transaction = { ...req.body, createdAt: new Date() };
    const result = await db.collection('transactions').insertOne(transaction);
    successResponse(res, 201, 'Transaction saved successfully', result);
  } catch (error) {
    next(error);
  }
}

async function getAllTransactions(req, res, next) {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactionsCollection = db.collection('transactions');
    const total = await transactionsCollection.countDocuments();
    const transactions = await transactionsCollection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    successResponse(res, 200, 'Transactions fetched successfully', transactions, {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPaymentIntent, saveTransaction, getAllTransactions };
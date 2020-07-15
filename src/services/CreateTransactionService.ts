// import AppError from '../errors/AppError';
import {
  getCustomRepository,
  getRepository,
  TransactionRepository,
} from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let transactioncategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!transactioncategory) {
      transactioncategory = categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(transactioncategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactioncategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

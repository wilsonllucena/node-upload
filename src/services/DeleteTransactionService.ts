import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransacactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransacactionsRepository);

    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }
    const response = await transactionRepository.remove(transaction);

    return response;
  }
}

export default DeleteTransactionService;

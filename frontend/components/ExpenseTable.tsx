'use client';

import { useState } from 'react';
import ExpenseModal, { type ExpenseFormData } from './ExpenseModal';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  category: Category;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onRefresh: () => void;
}

export default function ExpenseTable({
  expenses,
  onRefresh,
}: ExpenseTableProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseFormData | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    onRefresh();
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">💸</p>
        <p className="text-sm">No expenses yet. Add your first one!</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                Description
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                Category
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                Date
              </th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">
                Amount
              </th>
              <th className="py-3 px-4 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm text-gray-900">
                  {expense.description}
                </td>
                <td className="py-3 px-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${expense.category?.color || '#6b7280'}20`,
                      color: expense.category?.color || '#6b7280',
                    }}
                  >
                    {expense.category?.icon} {expense.category?.name}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(expense.date + 'T00:00:00').toLocaleDateString(
                    'en-US',
                    { month: 'short', day: 'numeric', year: 'numeric' },
                  )}
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                  ${parseFloat(String(expense.amount)).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() =>
                        setEditingExpense({
                          id: expense.id,
                          amount: expense.amount,
                          description: expense.description,
                          date: expense.date,
                          categoryId: expense.categoryId,
                        })
                      }
                      className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingExpense && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSaved={() => {
            setEditingExpense(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}

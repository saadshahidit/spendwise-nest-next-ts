'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import ExpenseTable, { type Expense } from '@/components/ExpenseTable';
import ExpenseModal from '@/components/ExpenseModal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ExpenseResponse {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  page: number;
  limit: number;
  categoryId: string;
  from: string;
  to: string;
}

export default function ExpensesPage() {
  const [response, setResponse] = useState<ExpenseResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    categoryId: '',
    from: '',
    to: '',
  });

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(filters.page));
      params.set('limit', String(filters.limit));
      if (filters.categoryId) params.set('categoryId', filters.categoryId);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);

      const r = await api.get(`/expenses?${params.toString()}`);
      setResponse(r.data);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <Button onClick={() => setShowModal(true)} className="px-4">
          + Add Expense
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <Select
              value={filters.categoryId}
              onChange={(e) => setFilters((f) => ({ ...f, categoryId: e.target.value, page: 1 }))}
              className="border-gray-200"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <Input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value, page: 1 }))}
              className="border-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <Input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value, page: 1 }))}
              className="border-gray-200"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="ghost"
              onClick={() => setFilters({ page: 1, limit: 10, categoryId: '', from: '', to: '' })}
              className="w-full"
            >
              Clear filters
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>
        ) : (
          <>
            <ExpenseTable expenses={response?.data || []} onRefresh={fetchExpenses} />
            {response && response.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">{response.total} total expenses</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    disabled={filters.page <= 1}
                    className="px-3 py-1.5"
                  >
                    Previous
                  </Button>
                  <span className="px-3 py-1.5 text-sm text-gray-600">
                    {filters.page} / {response.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                    disabled={filters.page >= response.totalPages}
                    className="px-3 py-1.5"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchExpenses(); }}
        />
      )}
    </div>
  );
}

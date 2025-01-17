import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#f59e0b', icon: '🍔' },
  { name: 'Transport', color: '#3b82f6', icon: '🚌' },
  { name: 'Utilities', color: '#8b5cf6', icon: '💡' },
  { name: 'Entertainment', color: '#ec4899', icon: '🎬' },
  { name: 'Health', color: '#10b981', icon: '💊' },
  { name: 'Shopping', color: '#f97316', icon: '🛍️' },
  { name: 'Other', color: '#6b7280', icon: '📦' },
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.category.count();
    if (count === 0) {
      await this.prisma.category.createMany({ data: DEFAULT_CATEGORIES });
    }
  }

  findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { motion } from "framer-motion";

interface Category {
  categoryId: number;
  categoryName: string;
  categoryShowName: string;
}

export function StoryTabs() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '1';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.post('/story/categoryList');
        if (response.data.errCode === '0') {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    router.push(`/?category=${categoryId}`);
  };

  return (
    <nav className="relative flex space-x-1 bg-background/95 p-1 rounded-lg">
      {categories.map((category) => {
        const isSelected = currentCategory === category.categoryId.toString();
        return (
          <button
            key={category.categoryId}
            onClick={() => handleCategoryChange(category.categoryId.toString())}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium transition-all",
              "hover:text-primary focus-visible:outline-none",
              isSelected ? "text-primary" : "text-muted-foreground"
            )}
          >
            {category.categoryShowName}
            {isSelected && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-muted rounded-md"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/mockApi';
import { MenuItem, CuisineType, MealTime } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import MenuItemCard from '@/components/MenuItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [selectedMealTime, setSelectedMealTime] = useState<string>('all');
  const [showVegOnly, setShowVegOnly] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snacks', 'beverages'];
  const cuisines: Array<CuisineType | 'all'> = ['all', 'north-indian', 'south-indian', 'chettinad', 'chinese', 'continental', 'beverages', 'snacks'];
  const mealTimes: Array<MealTime | 'all'> = ['all', 'breakfast', 'lunch', 'dinner', 'all-day'];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const items = await mockApi.getMenuItems();
      setMenuItems(items);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart`,
    });
  };

  const getCuisineLabel = (cuisine: string) => {
    const labels: Record<string, string> = {
      'all': 'All Cuisines',
      'north-indian': 'North Indian',
      'south-indian': 'South Indian',
      'chettinad': 'Chettinad',
      'chinese': 'Chinese',
      'continental': 'Continental',
      'beverages': 'Beverages',
      'snacks': 'Snacks',
    };
    return labels[cuisine] || cuisine;
  };

  const getMealTimeLabel = (mealTime: string) => {
    const labels: Record<string, string> = {
      'all': 'All Times',
      'breakfast': 'Breakfast',
      'lunch': 'Lunch',
      'dinner': 'Dinner',
      'all-day': 'Available All Day',
    };
    return labels[mealTime] || mealTime;
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCuisine = selectedCuisine === 'all' || item.cuisine === selectedCuisine;
    const matchesMealTime = selectedMealTime === 'all' || item.mealTime === selectedMealTime;
    const matchesVeg = !showVegOnly || item.isVeg;
    return matchesSearch && matchesCategory && matchesCuisine && matchesMealTime && matchesVeg;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedCuisine('all');
    setSelectedMealTime('all');
    setShowVegOnly(false);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedCuisine !== 'all',
    selectedMealTime !== 'all',
    showVegOnly,
    searchQuery !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Menu</h1>
          <p className="text-muted-foreground">Browse our delicious offerings - {menuItems.length} dishes available</p>
        </div>

        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedMealTime} onValueChange={setSelectedMealTime}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Meal Time" />
              </SelectTrigger>
              <SelectContent>
                {mealTimes.map(time => (
                  <SelectItem key={time} value={time}>
                    {getMealTimeLabel(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {getCuisineLabel(cuisine)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="capitalize">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showVegOnly ? 'default' : 'outline'}
              onClick={() => setShowVegOnly(!showVegOnly)}
              className="w-full sm:w-auto"
            >
              🌱 Veg Only
            </Button>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
                Clear ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedMealTime !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedMealTime('all')}>
                  {getMealTimeLabel(selectedMealTime)} ✕
                </Badge>
              )}
              {selectedCuisine !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCuisine('all')}>
                  {getCuisineLabel(selectedCuisine)} ✕
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer capitalize" onClick={() => setSelectedCategory('all')}>
                  {selectedCategory} ✕
                </Badge>
              )}
              {showVegOnly && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setShowVegOnly(false)}>
                  Veg Only ✕
                </Badge>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg mb-2">No items found</p>
            <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
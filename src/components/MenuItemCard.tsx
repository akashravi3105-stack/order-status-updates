"use client";

import { MenuItem } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Flame, Leaf } from 'lucide-react';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const getCuisineLabel = (cuisine: string) => {
    const labels: Record<string, string> = {
      'north-indian': 'North Indian',
      'south-indian': 'South Indian',
      'chettinad': 'Chettinad',
      'chinese': 'Chinese',
      'continental': 'Continental',
      'beverages': 'Beverage',
      'snacks': 'Snack'
    };
    return labels[cuisine] || cuisine;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover" />

        {!item.available &&
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Not Available</Badge>
          </div>
        }
        <div className="absolute top-2 right-2 flex gap-1">
          {item.isVeg ?
          <Badge className="bg-green-500 hover:bg-green-600">
              <Leaf className="h-3 w-3 mr-1" />
              Veg
            </Badge> :

          <Badge className="bg-red-500 hover:bg-red-600">
              Non-Veg
            </Badge>
          }
          {item.isSpicy &&
          <Badge variant="destructive">
              <Flame className="h-3 w-3" />
            </Badge>
          }
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg !w-[33%] !h-full">{item.name}</h3>
        </div>
        <div className="flex gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {getCuisineLabel(item.cuisine)}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {item.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">₹{item.price}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {item.preparationTime}m
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart(item)}
          disabled={!item.available}>

          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>);

}
"use client";

import { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: AlertCircle },
  approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
  preparing: { label: 'Preparing', variant: 'default' as const, icon: Package },
  ready: { label: 'Ready', variant: 'default' as const, icon: CheckCircle },
  completed: { label: 'Completed', variant: 'outline' as const, icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  return (
    <Card
      className={`cursor-pointer hover:shadow-lg transition-shadow ${onClick ? 'hover:border-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Order #{order.id}</CardTitle>
          <Badge variant={config.variant}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {format(new Date(order.createdAt), 'MMM dd, yyyy - hh:mm a')}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Customer:</span>
            <span className="font-medium">{order.userName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items:</span>
            <span className="font-medium">{order.items.length} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment:</span>
            <span className="font-medium uppercase">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-bold text-lg">₹{order.totalAmount}</span>
          </div>
          {order.estimatedTime && (
            <div className="flex items-center justify-center gap-2 mt-2 p-2 bg-primary/10 rounded-md">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Ready in {order.estimatedTime} mins</span>
            </div>
          )}
          {order.rejectionReason && (
            <div className="mt-2 p-2 bg-destructive/10 rounded-md">
              <p className="text-sm text-destructive">{order.rejectionReason}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

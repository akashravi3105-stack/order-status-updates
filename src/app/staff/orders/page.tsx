"use client";

import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/mockApi';
import { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function StaffOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
    // Poll for updates every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await mockApi.getOrders();
      setOrders(allOrders);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedOrder || !estimatedTime) return;

    setActionLoading(true);
    try {
      await mockApi.updateOrderStatus(
        selectedOrder.id,
        'approved',
        parseInt(estimatedTime)
      );
      toast({
        title: 'Order approved',
        description: `Order #${selectedOrder.id} has been approved`,
      });
      setSelectedOrder(null);
      setEstimatedTime('');
      await loadOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve order',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedOrder || !rejectionReason) return;

    setActionLoading(true);
    try {
      await mockApi.updateOrderStatus(
        selectedOrder.id,
        'rejected',
        undefined,
        rejectionReason
      );
      toast({
        title: 'Order rejected',
        description: `Order #${selectedOrder.id} has been rejected`,
      });
      setSelectedOrder(null);
      setRejectionReason('');
      await loadOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject order',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: 'preparing' | 'ready' | 'completed') => {
    setActionLoading(true);
    try {
      await mockApi.updateOrderStatus(orderId, status);
      toast({
        title: 'Status updated',
        description: `Order status changed to ${status}`,
      });
      await loadOrders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => ['approved', 'preparing', 'ready'].includes(o.status));
  const completedOrders = orders.filter(o => ['completed', 'rejected'].includes(o.status));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Orders Management</h1>
            <p className="text-muted-foreground">Manage and process orders</p>
          </div>
          <Button variant="outline" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="pending">
              Pending
              {pendingOrders.length > 0 && (
                <Badge className="ml-2" variant="destructive">{pendingOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              {approvedOrders.length > 0 && (
                <Badge className="ml-2">{approvedOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            ) : pendingOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingOrders.map(order => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order #{order.id}</span>
                        <Badge variant="secondary">Pending</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'hh:mm a')}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{order.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Items</p>
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm">
                            {item.quantity}× {item.menuItem.name}
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Review Order
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending orders</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {approvedOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order #{order.id}</span>
                        <Badge>{order.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-medium">{order.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • ₹{order.totalAmount}
                        </p>
                      </div>
                      {order.estimatedTime && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          Ready in {order.estimatedTime} mins
                        </div>
                      )}
                      <div className="space-y-2">
                        {order.status === 'approved' && (
                          <Button
                            className="w-full"
                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                            disabled={actionLoading}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button
                            className="w-full"
                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                            disabled={actionLoading}
                          >
                            Mark as Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            className="w-full"
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            disabled={actionLoading}
                          >
                            Complete Order
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active orders</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedOrders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Order #{order.id}</span>
                        <Badge variant={order.status === 'completed' ? 'outline' : 'destructive'}>
                          {order.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, hh:mm a')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} items • ₹{order.totalAmount}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed orders</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Order - #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium text-lg">{selectedOrder.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Order Items</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 border rounded">
                      <span>{item.quantity}× {item.menuItem.name}</span>
                      <span className="font-semibold">
                        ₹{item.menuItem.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span>₹{selectedOrder.totalAmount}</span>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="estimatedTime">Estimated Preparation Time (minutes)</Label>
                    <Input
                      id="estimatedTime"
                      type="number"
                      placeholder="e.g., 20"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="e.g., Item not available"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason || actionLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Order
              </Button>
              <Button
                onClick={handleApprove}
                disabled={!estimatedTime || actionLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

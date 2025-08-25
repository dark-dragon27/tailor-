import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Shirt, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@shared/schema";

interface OrderListProps {
  onBack: () => void;
}

export function OrderList({ onBack }: OrderListProps) {
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    retry: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'fitting_scheduled': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-dark-gray">All Orders</h1>
              <p className="text-gray-600">View and manage your orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
              <p className="text-gray-500">Start by creating your first tailoring order</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow" data-testid={`order-card-${order.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark-gray" data-testid={`order-title-${order.id}`}>
                          {order.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order #{order.id.slice(0, 8)} • {new Date(order.createdAt!).toLocaleDateString()}
                        </p>
                        {order.description && (
                          <p className="text-sm text-gray-500 mt-1" data-testid={`order-description-${order.id}`}>
                            {order.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex gap-2 mb-2">
                          <Badge 
                            className={getStatusColor(order.status!)}
                            data-testid={`order-status-${order.id}`}
                          >
                            {order.status?.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            className={getPriorityColor(order.priority!)}
                            data-testid={`order-priority-${order.id}`}
                          >
                            {order.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Service: <span className="font-medium">{order.serviceType}</span>
                        </p>
                        {order.price && (
                          <p className="text-lg font-bold text-dark-gray" data-testid={`order-price-${order.id}`}>
                            ${order.price}
                          </p>
                        )}
                        {order.dueDate && (
                          <p className="text-sm text-gray-600">
                            Due: {new Date(order.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" data-testid={`button-view-order-${order.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

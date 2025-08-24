import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  CheckCircle, 
  Ruler, 
  Calendar, 
  Plus, 
  CalendarPlus,
  ChevronDown,
  Shirt,
  LayoutDashboard,
  Users,
  BarChart
} from "lucide-react";
import { OrderForm } from "@/components/order-form";
import { MeasurementForm } from "@/components/measurement-form";
import { OrderList } from "@/components/order-list";
import type { Order, User } from "@shared/schema";

export default function CustomerDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
    retry: false,
  });

  const { data: measurements } = useQuery({
    queryKey: ["/api/measurements"],
    enabled: !!user,
    retry: false,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = (user as any)?.role === 'admin';
  const activeOrders = orders.filter(order => 
    order.status === 'in_progress' || order.status === 'confirmed'
  );
  const completedOrders = orders.filter(order => order.status === 'completed');
  const recentOrders = orders.slice(0, 3);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}` || 'U';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showAllOrders) {
    return <OrderList onBack={() => setShowAllOrders(false)} />;
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif font-bold text-navy">Taletique</h1>
              <nav className="hidden md:flex space-x-8">
                {isAdmin && (
                  <>
                    <button className="text-dark-gray hover:text-navy font-medium transition-colors flex items-center gap-2" data-testid="nav-dashboard">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button className="text-dark-gray hover:text-navy font-medium transition-colors flex items-center gap-2" data-testid="nav-customers">
                      <Users className="w-4 h-4" />
                      Customers
                    </button>
                    <button className="text-dark-gray hover:text-navy font-medium transition-colors flex items-center gap-2" data-testid="nav-reports">
                      <BarChart className="w-4 h-4" />
                      Reports
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setShowAllOrders(true)}
                  className="text-dark-gray hover:text-navy font-medium transition-colors" 
                  data-testid="nav-orders"
                >
                  My Orders
                </button>
                <button 
                  onClick={() => setShowMeasurementForm(true)}
                  className="text-dark-gray hover:text-navy font-medium transition-colors" 
                  data-testid="nav-measurements"
                >
                  Measurements
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowOrderForm(true)}
                className="bg-navy text-white hover:bg-blue-800 transition-colors"
                data-testid="button-new-order"
              >
                New Order
              </Button>
              <div className="relative">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-dark-gray hover:text-navy"
                  data-testid="button-user-menu"
                >
                  <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-sm font-medium">
                    <span data-testid="text-user-initials">
                      {getInitials((user as any)?.firstName || '', (user as any)?.lastName || '')}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-dark-gray mb-2">
            Welcome back, <span data-testid="text-user-name">{(user as any)?.firstName || 'User'}</span>!
          </h2>
          <p className="text-gray-600">Manage your tailoring orders and measurements</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-dark-gray" data-testid="stat-active-orders">
                    {activeOrders.length}
                  </p>
                </div>
                <div className="bg-navy/10 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-navy" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-dark-gray" data-testid="stat-completed-orders">
                    {completedOrders.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Measurements</p>
                  <p className="text-2xl font-bold text-dark-gray" data-testid="stat-measurements">
                    {measurements ? '1' : '0'}
                  </p>
                </div>
                <div className="bg-maroon/10 p-3 rounded-lg">
                  <Ruler className="w-6 h-6 text-maroon" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Next Fitting</p>
                  <p className="text-lg font-bold text-dark-gray" data-testid="stat-next-fitting">
                    TBD
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-dark-gray">Recent Orders</h3>
              <Button 
                variant="ghost" 
                onClick={() => setShowAllOrders(true)}
                data-testid="button-view-all-orders"
              >
                View All
              </Button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {ordersLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No orders yet. Create your first order!</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors" data-testid={`order-item-${order.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark-gray" data-testid={`order-title-${order.id}`}>
                          {order.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Order #{order.id.slice(0, 8)} • {new Date(order.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status!)}`}
                        data-testid={`order-status-${order.id}`}
                      >
                        {order.status?.replace('_', ' ')}
                      </span>
                      <Button variant="ghost" size="sm" data-testid={`button-view-order-${order.id}`}>
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => setShowOrderForm(true)}
            data-testid="card-new-order"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-navy p-3 rounded-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">New Order</h4>
                  <p className="text-sm text-gray-600">Start a new tailoring project</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => setShowMeasurementForm(true)}
            data-testid="card-update-measurements"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-maroon p-3 rounded-lg">
                  <Ruler className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">Update Measurements</h4>
                  <p className="text-sm text-gray-600">Add or modify your measurements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            data-testid="card-schedule-consultation"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 p-3 rounded-lg">
                  <CalendarPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">Schedule Consultation</h4>
                  <p className="text-sm text-gray-600">Book a fitting appointment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      {showOrderForm && (
        <OrderForm onClose={() => setShowOrderForm(false)} />
      )}
      
      {showMeasurementForm && (
        <MeasurementForm onClose={() => setShowMeasurementForm(false)} />
      )}
    </div>
  );
}

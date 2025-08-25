import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Users, 
  DollarSign, 
  CalendarClock,
  Plus,
  LogOut,
  LayoutDashboard,
  Ruler,
  Calendar,
  BarChart,
  UserPlus,
  Shirt
} from "lucide-react";
import { OrderForm } from "@/components/order-form";
import { CustomerList } from "@/components/customer-list";
import type { Order, User } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user as any)?.role !== 'admin')) {
      toast({
        title: "Unauthorized", 
        description: "Admin access required",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user && (user as any)?.role === 'admin',
    retry: false,
  });

  const { data: customers = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/customers"],
    enabled: !!user && (user as any)?.role === 'admin',
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!user && (user as any)?.role === 'admin',
    retry: false,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (!isAuthenticated || !user || (user as any)?.role !== 'admin') {
    return null;
  }

  const recentOrders = orders.slice(0, 5);
  const recentActivity = customers.slice(0, 5).map(customer => ({
    customerName: `${customer.firstName} ${customer.lastName}`,
    action: 'joined the platform',
    time: new Date(customer.createdAt!).toLocaleDateString() || 'recently'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCustomers) {
    return <CustomerList onBack={() => setShowCustomers(false)} />;
  }

  return (
    <div className="min-h-screen bg-light-gray flex">
      {/* Sidebar */}
      <div className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-2xl font-serif font-bold">Taletique Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-800 text-white' : 'hover:bg-blue-800'
            }`}
            data-testid="nav-dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setShowCustomers(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            data-testid="nav-customers"
          >
            <Users className="w-5 h-5" />
            Customers
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors ${
              activeTab === 'orders' ? 'bg-blue-800 text-white' : ''
            }`}
            data-testid="nav-orders"
          >
            <Package className="w-5 h-5" />
            Orders
          </button>
          <button 
            onClick={() => setActiveTab('measurements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors ${
              activeTab === 'measurements' ? 'bg-blue-800 text-white' : ''
            }`}
            data-testid="nav-measurements"
          >
            <Ruler className="w-5 h-5" />
            Measurements
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors ${
              activeTab === 'schedule' ? 'bg-blue-800 text-white' : ''
            }`}
            data-testid="nav-schedule"
          >
            <Calendar className="w-5 h-5" />
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors ${
              activeTab === 'reports' ? 'bg-blue-800 text-white' : ''
            }`}
            data-testid="nav-reports"
          >
            <BarChart className="w-5 h-5" />
            Reports
          </button>
        </nav>
        
        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-gray">Dashboard Overview</h2>
              <p className="text-gray-600">Manage your tailoring business</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowOrderForm(true)}
                className="bg-navy text-white hover:bg-blue-800 transition-colors"
                data-testid="button-create-order"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
              <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-dark-gray" data-testid="stat-total-orders">
                      {(stats as any)?.totalOrders || orders.length}
                    </p>
                    <p className="text-sm text-green-600 font-medium">+12% from last month</p>
                  </div>
                  <div className="bg-navy/10 p-3 rounded-lg">
                    <Package className="w-8 h-8 text-navy" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Customers</p>
                    <p className="text-3xl font-bold text-dark-gray" data-testid="stat-active-customers">
                      {(stats as any)?.activeCustomers || customers.length}
                    </p>
                    <p className="text-sm text-green-600 font-medium">+5% from last month</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-dark-gray" data-testid="stat-revenue">
                      ${orders.reduce((sum, order) => sum + (parseFloat(order.price || '0')), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 font-medium">+18% from last month</p>
                  </div>
                  <div className="bg-maroon/10 p-3 rounded-lg">
                    <DollarSign className="w-8 h-8 text-maroon" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Fittings</p>
                    <p className="text-3xl font-bold text-dark-gray" data-testid="stat-pending-fittings">
                      {(stats as any)?.pendingFittings || orders.filter(o => o.status === 'fitting_scheduled').length}
                    </p>
                    <p className="text-sm text-yellow-600 font-medium">Needs attention</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <CalendarClock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-dark-gray">Recent Orders</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {ordersLoading ? (
                  <div className="p-4">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors" data-testid={`admin-order-${order.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
                            <Shirt className="w-5 h-5 text-navy" />
                          </div>
                          <div>
                            <p className="font-medium text-dark-gray" data-testid={`order-customer-${order.id}`}>
                              {order.title}
                            </p>
                            <p className="text-sm text-gray-600">{order.serviceType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status!)}`}
                            data-testid={`order-status-${order.id}`}
                          >
                            {order.status?.replace('_', ' ')}
                          </span>
                          <p className="text-sm text-gray-600 mt-1" data-testid={`order-amount-${order.id}`}>
                            ${order.price || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Customer Activity */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-dark-gray">Customer Activity</h3>
              </div>
              <div className="p-6 space-y-4">
                {customers.length === 0 ? (
                  <p className="text-gray-500 text-center">No customer activity yet</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3" data-testid={`activity-${index}`}>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-dark-gray">
                          <span className="font-medium" data-testid={`activity-customer-${index}`}>
                            {activity.customerName}
                          </span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500" data-testid={`activity-time-${index}`}>
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm onClose={() => setShowOrderForm(false)} />
      )}
    </div>
  );
}

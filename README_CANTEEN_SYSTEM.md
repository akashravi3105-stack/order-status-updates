# 🍽️ Canteen Ordering System

A complete canteen ordering system with separate interfaces for customers and staff, featuring real-time order tracking, cart management, and order approval workflows.

## ✨ Features

### For Customers
- **Menu Browsing**: Browse food items by category (breakfast, lunch, dinner, snacks, beverages)
- **Search & Filter**: Search menu items and filter by category
- **Cart Management**: Add items to cart, adjust quantities, and manage orders
- **Multiple Payment Options**: Choose from Cash, Card, or UPI payment methods
- **Order Tracking**: Real-time order status updates (pending → approved → preparing → ready → completed)
- **Order History**: View all past and current orders

### For Staff
- **Orders Dashboard**: View all orders organized by status (Pending, Active, Completed)
- **Order Management**: Review incoming orders with full details
- **Approve/Reject Orders**: Accept orders with estimated preparation time or reject with reason
- **Status Updates**: Update order status through the workflow (approved → preparing → ready → completed)
- **Real-time Updates**: Auto-refresh every 5 seconds to catch new orders

## 🚀 Quick Start

### Demo Accounts

The system includes two demo accounts for quick testing:

**Customer Account:**
- Click "Demo Customer" on login page
- Access: Menu browsing, cart, checkout, order tracking

**Staff Account:**
- Click "Demo Staff" on login page  
- Access: Orders dashboard, order approval, status management

### Creating New Accounts

1. Go to `/register`
2. Fill in your details
3. Select account type:
   - **Customer**: For ordering food
   - **Staff**: For managing orders
4. Register and you'll be automatically logged in

## 📱 User Flows

### Customer Journey

1. **Login** → `/login` or click "Demo Customer"
2. **Browse Menu** → `/customer/menu`
   - Search items
   - Filter by category
   - View prices and preparation times
3. **Add to Cart** → Click "Add to Cart" on items
4. **Review Cart** → `/customer/cart`
   - Adjust quantities
   - Remove items
   - See total with GST
5. **Checkout** → `/customer/checkout`
   - Review order items
   - Select payment method
   - Place order
6. **Track Orders** → `/customer/orders`
   - View all orders
   - Check real-time status
   - See estimated preparation time

### Staff Workflow

1. **Login** → `/login` or click "Demo Staff"
2. **View Orders** → `/staff/orders`
   - **Pending Tab**: New orders awaiting approval
   - **Active Tab**: Orders being prepared
   - **Completed Tab**: Finished orders
3. **Review Order** → Click "Review Order"
   - See customer details
   - View ordered items
   - Check total amount
4. **Approve/Reject**:
   - **Approve**: Enter estimated time (e.g., 20 minutes)
   - **Reject**: Enter reason (e.g., "Item not available")
5. **Update Status**:
   - Approved → "Start Preparing"
   - Preparing → "Mark as Ready"
   - Ready → "Complete Order"

## 🎨 Design Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Updates**: 
  - Customer orders refresh every 10 seconds
  - Staff dashboard refreshes every 5 seconds
- **Toast Notifications**: Success/error messages for all actions
- **Loading States**: Skeleton loaders and spinners
- **Role-based Navigation**: Different nav bars for customers and staff
- **Auto-routing**: Logged-in users automatically redirected to their dashboard

## 📊 Sample Menu Items

The system includes 8 sample items:
- **Breakfast**: Masala Dosa, Idli Sambar
- **Lunch**: Veg Thali, Paneer Butter Masala
- **Dinner**: Biryani
- **Snacks**: Samosa
- **Beverages**: Masala Chai, Filter Coffee

## 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: Shadcn/UI components
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Formatting**: date-fns
- **Storage**: LocalStorage for cart and auth persistence

## 📁 Project Structure

```
src/
├── app/
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── customer/
│   │   ├── menu/           # Menu browsing
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Order checkout
│   │   └── orders/         # Order tracking
│   └── staff/
│       └── orders/         # Orders management
├── components/
│   ├── Navigation.tsx      # Role-based navigation
│   ├── MenuItemCard.tsx    # Menu item display
│   ├── OrderCard.tsx       # Order display
│   └── Providers.tsx       # Context providers
├── contexts/
│   ├── AuthContext.tsx     # Authentication state
│   └── CartContext.tsx     # Shopping cart state
└── lib/
    ├── types.ts            # TypeScript interfaces
    └── mockApi.ts          # Mock API functions

## 🎯 Order Status Flow

```
PENDING → APPROVED → PREPARING → READY → COMPLETED
             ↓
          REJECTED
```

## 💡 Tips

1. **Test Complete Flow**: 
   - Open two browser windows
   - Login as customer in one, staff in other
   - Place order as customer, approve as staff
   - Watch real-time status updates

2. **Cart Persistence**: Cart items are saved in localStorage and persist across page refreshes

3. **Auto-refresh**: Orders automatically refresh, no need to manually reload

4. **Estimated Time**: Staff sets this when approving orders, customers see it in their order tracking

## 🔒 Security Notes

This is a demo system using:
- Mock API (no real backend)
- LocalStorage for persistence
- No password encryption
- No actual payment processing

For production use, implement:
- Real backend API
- Database integration
- Proper authentication (JWT, sessions)
- Payment gateway integration
- Security best practices

## 🎨 Customization

To modify menu items, edit `src/lib/mockApi.ts`:
```typescript
const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Your Item',
    description: 'Description',
    price: 100,
    category: 'lunch',
    image: 'https://...',
    available: true,
    preparationTime: 15,
  },
  // Add more items...
];
```

---

**Built with ❤️ for seamless canteen operations**

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Restaurant, MenuItem, Table, Order, StaffMember, CartItem, Client } from '../types';

interface AppContextProps {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  staff: StaffMember[];
  cart: CartItem[];
  clientUser: Client | null;
  ownerUser: any | null;
  activeRestaurantId: string | null;
  selectedTableId: string | null;
  currentAppState: string;
  addRestaurant: (r: Restaurant) => void;
  updateMenuItemAvailability: (id: string, isAvailable: boolean) => void;
  addMenuItem: (item: MenuItem) => void;
  editMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  addTable: (t: Table) => void;
  toggleTableStatus: (id: string) => void;
  addStaff: (s: StaffMember) => void;
  removeStaff: (id: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  setClientUser: (c: Client | null) => void;
  setOwnerUser: (o: any | null) => void;
  setActiveRestaurantId: (id: string | null) => void;
  setSelectedTableId: (id: string | null) => void;
  setCurrentAppState: (state: string) => void;
  placeOrder: (momoPhone: string) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: 'Pending' | 'Preparing' | 'Done') => void;
  triggerMockIncomingOrder: () => void;
  newOrderAlert: boolean;
  setNewOrderAlert: (alert: boolean) => void;
  companyName: string;
  companyLogo: string;
  brandCandidates: { name: string; logoUrl: string; tagline: string; themeColor: string; description: string; detail: string }[];
  selectedBrandIndex: number;
  setSelectedBrandIndex: (index: number) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const initialRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Kigali Bites',
    description: 'Authentic local delicacies paired with modern culinary mastery.',
    logo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80',
    rating: 148,
    location: 'Nyarugenge, Kigali',
  },
  {
    id: 'rest-2',
    name: 'Ireme Foods',
    description: 'Famous spicy dry-fried glazed skewers and classic side brochettes.',
    logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80',
    rating: 124,
    location: 'Kimihurura, Kigali',
  },
  {
    id: 'rest-3',
    name: 'Urban Eats',
    description: 'Fresh seafood, pan-seared lake fish, grilled meat bowls and greens.',
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80',
    rating: 98,
    location: 'Gisozi, Kigali',
  },
  {
    id: 'rest-4',
    name: 'Food Hub Palace',
    description: 'Exquisite desserts and freshly brewed local spiced juices.',
    logo: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=150&q=80',
    rating: 85,
    location: 'Remera, Kigali',
  },
];

const initialMenuItems: MenuItem[] = [
  // Drinks
  {
    id: 'item-1',
    name: 'MTN Ginger Beer',
    description: 'Local ginger blended with caramelized sugar, mint, and lemon zests.',
    price: 3.50,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 45,
  },
  {
    id: 'item-2',
    name: 'Hibiscus Iced Punch',
    description: 'Brewed local hibiscus leaves infused with natural honey and orange strips.',
    price: 4.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 30,
  },
  {
    id: 'item-3',
    name: 'Passion Fruit Fizz',
    description: 'Local yellow passion purée blended with club soda and visual mint sprigs.',
    price: 4.50,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 25,
  },
  // Mains
  {
    id: 'item-4',
    name: 'Isombe and Cassava',
    description: 'Finely mashed organic cassava leaves, cooked with beef marrow and peanuts.',
    price: 12.50,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 12,
  },
  {
    id: 'item-5',
    name: 'Akabenzi (Pork Special)',
    description: 'Famous pan-roasted glazed sweet-savory tender pork chunk squares.',
    price: 15.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 8,
  },
  {
    id: 'item-6',
    name: 'Kigali Garlic Tilapia',
    description: 'Pan-seared spiced fresh whole fish served with a spicy direct kachumbari crust.',
    price: 18.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 15,
  },
  {
    id: 'item-7',
    name: 'Gatuna Skewer Brochette',
    description: 'Smoked goat meat cubes on skewers, grilled with onions and bell pepper slices.',
    price: 11.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 20,
  },
  // Desserts
  {
    id: 'item-8',
    name: 'Tropical Mango Sorbet',
    description: 'Creamy cold organic local mango puree whipped with subtle coconut cream.',
    price: 6.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 18,
  },
  {
    id: 'item-9',
    name: 'Warm Cardamom Mandazi',
    description: 'Classic East-African sweet dough pastry, dusted with refined sugar & sweet cream dip.',
    price: 5.50,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=250&q=80',
    isAvailable: true,
    stock: 5,
  },
];

const initialTables: Table[] = [
  { id: 'Table-01', location: 'Window View Seat', status: 'Free' },
  { id: 'Table-02', location: 'Cozy Fireplace Corner', status: 'Free' },
  { id: 'Table-03', location: 'Open-Air Terrace Rooftop', status: 'Free' },
  { id: 'Table-04', location: 'VIP Lounge Couch', status: 'Free' },
  { id: 'Table-05', location: 'Garden Hideout Table', status: 'Free' },
  { id: 'Table-06', location: 'Bar Bench Corner', status: 'Free' },
];

const initialStaff: StaffMember[] = [
  { id: 'S-01', name: 'Aimé Gatari', role: 'Manager', phone: '+250 788 321 445', email: 'aime@gmail.com' },
  { id: 'S-02', name: 'Chantal U.', role: 'Chef', phone: '+250 785 102 334', email: 'chantal@gmail.com' },
  { id: 'S-03', name: 'Jacques Ndala', role: 'Waiter', phone: '+250 783 234 567', email: 'jacques@gmail.com' },
];

const initialOrders: Order[] = [
  {
    id: 'ORD-9844',
    tableId: 'Table-01',
    restaurantId: 'rest-1',
    restaurantName: 'Kigali Bites',
    items: [
      { id: 'item-5', name: 'Akabenzi (Pork Special)', price: 15.00, quantity: 2 },
      { id: 'item-1', name: 'MTN Ginger Beer', price: 3.50, quantity: 2 },
    ],
    total: 37.00,
    status: 'Pending',
    date: '2026-06-07T10:30:00Z',
    clientName: 'Natali Craig',
    clientPhone: '0788777999',
  },
  {
    id: 'ORD-9612',
    tableId: 'Table-03',
    restaurantId: 'rest-1',
    restaurantName: 'Kigali Bites',
    items: [
      { id: 'item-6', name: 'Kigali Garlic Tilapia', price: 18.00, quantity: 1 },
      { id: 'item-3', name: 'Passion Fruit Fizz', price: 4.50, quantity: 2 },
    ],
    total: 27.00,
    status: 'Preparing',
    date: '2026-06-07T09:45:00Z',
    clientName: 'Kate Morrison',
    clientPhone: '0781212121',
  },
  {
    id: 'ORD-9302',
    tableId: 'Table-05',
    restaurantId: 'rest-2',
    restaurantName: 'Ireme Foods',
    items: [
      { id: 'item-7', name: 'Gatuna Skewer Brochette', price: 11.00, quantity: 3 },
      { id: 'item-9', name: 'Warm Cardamom Mandazi', price: 5.50, quantity: 1 },
    ],
    total: 38.50,
    status: 'Done',
    date: '2026-06-06T19:30:00Z',
    clientName: 'Orlando Diggs',
    clientPhone: '0789090909',
  },
];

const generateUniqueOrderId = (existingOrders: Order[]): string => {
  let attempts = 0;
  let newId = '';
  do {
    newId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    attempts++;
  } while (existingOrders.some((o) => o?.id === newId) && attempts < 50);

  if (attempts >= 50) {
    newId = `ORD-${Date.now().toString().slice(-4)}-${Math.floor(10 + Math.random() * 90)}`;
  }
  return newId;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('supa_restaurants');
    return saved ? JSON.parse(saved) : initialRestaurants;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('supa_menu_items');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('supa_tables');
    return saved ? JSON.parse(saved) : initialTables;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('supa_orders');
    if (saved) {
      try {
        const parsed: Order[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.filter((o) => {
          if (!o || !o.id || seen.has(o.id)) return false;
          seen.add(o.id);
          return true;
        });
      } catch (e) {
        return initialOrders;
      }
    }
    return initialOrders;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('supa_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientUser, setClientUser] = useState<Client | null>(() => {
    const saved = localStorage.getItem('supa_client_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [ownerUser, setOwnerUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('supa_owner_user');
    return saved ? JSON.parse(saved) : {
      name: 'Jacques Kagabo',
      email: 'jacqueskagabo1@gmail.com',
      phone: '+250 788 112 233',
      restaurantName: 'Kigali Bites',
      logo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80',
      description: 'Authentic local delicacies paired with modern culinary mastery.',
      location: 'Nyarugenge, Kigali',
    };
  });

  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(() => {
    return 'rest-1'; // default active
  });
  
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [currentAppState, setCurrentAppState] = useState<string>('landing');
  const [newOrderAlert, setNewOrderAlert] = useState<boolean>(false);

  // Dynamic Company Branding Candidates
  const brandCandidates = [
    {
      name: 'Lula',
      logoUrl: '/src/assets/images/brand_logo_one_emerald_1780852932318.png',
      tagline: 'SMART RESTAURANTS',
      themeColor: '#22C55E',
      description: 'Bantu for "easy & light". Immersive QR menu tableside checkout built to delight diners elegantly.',
      detail: 'Features a fresh, modern aesthetic centering our custom-designed Emerald Leaf Plate signature motif.'
    },
    {
      name: 'Ora App',
      logoUrl: '/src/assets/images/brand_logo_three_loop_1780852963358.png',
      tagline: 'INSTANT DINING',
      themeColor: '#10B981',
      description: 'Latin-derived meaning "hour/time". The instant tableside order-to-table system built for high-scale restaurants.',
      detail: 'Centers on the futuristic Overlapping Infinity Nested Plates Loop, reflecting perpetual synced updates.'
    },
    {
      name: 'TableTap',
      logoUrl: '/src/assets/images/brand_logo_two_gold_bird_1780852947944.png',
      tagline: 'DIRECT STREAMLINED',
      themeColor: '#F59E0B',
      description: 'Honest, premium, clear. Empowering guests to checkout and call service in under 3 seconds.',
      detail: 'Adorns the luxury Geometric Hummingbird/Golden Crane symbol of supreme speed and precise service.'
    }
  ];

  const [selectedBrandIndex, setSelectedBrandIndex] = useState<number>(() => {
    const saved = localStorage.getItem('selected_brand_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('selected_brand_index', selectedBrandIndex.toString());
  }, [selectedBrandIndex]);

  const activeBrand = brandCandidates[selectedBrandIndex] || brandCandidates[0];
  const companyName = activeBrand.name;
  const companyLogo = activeBrand.logoUrl;

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('supa_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('supa_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('supa_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('supa_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('supa_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    if (clientUser) {
      localStorage.setItem('supa_client_user', JSON.stringify(clientUser));
    } else {
      localStorage.removeItem('supa_client_user');
    }
  }, [clientUser]);

  useEffect(() => {
    if (ownerUser) {
      localStorage.setItem('supa_owner_user', JSON.stringify(ownerUser));
    } else {
      localStorage.removeItem('supa_owner_user');
    }
  }, [ownerUser]);

  // Actions
  const addRestaurant = (r: Restaurant) => {
    setRestaurants((prev) => {
      const filtered = prev.filter((item) => item.id !== r.id);
      return [r, ...filtered];
    });
  };

  const updateMenuItemAvailability = (id: string, isAvailable: boolean) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable } : item))
    );
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => [item, ...prev]);
  };

  const editMenuItem = (item: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((i) => (i.id === item.id ? item : i))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addTable = (t: Table) => {
    setTables((prev) => [...prev, t]);
  };

  const toggleTableStatus = (id: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Free' ? 'Occupied' : 'Free' }
          : t
      )
    );
  };

  const addStaff = (s: StaffMember) => {
    setStaff((prev) => [...prev, s]);
  };

  const removeStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  // Cart Management
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { id: item.id, menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === itemId);
      if (exists && exists.quantity > 1) {
        return prev.map((c) =>
          c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        );
      }
      return prev.filter((c) => c.id !== itemId);
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((c) => (c.id === itemId ? { ...c, quantity: qty } : c))
      );
    }
  };

  const clearCart = () => setCart([]);

  // Place order flow
  const placeOrder = async (momoPhone: string): Promise<string | null> => {
    const activeRestaurant = restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];
    const newOrderId = generateUniqueOrderId(orders);
    const newOrder: Order = {
      id: newOrderId,
      tableId: selectedTableId || 'Table-01',
      restaurantId: activeRestaurantId || 'rest-1',
      restaurantName: activeRestaurant.name,
      items: cart.map((c) => ({
        id: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity,
      })),
      total: cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0),
      status: 'Pending',
      date: new Date().toISOString(),
      clientName: clientUser?.name || 'Walk-in Client',
      clientPhone: momoPhone || clientUser?.phone || '0780000000',
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    // Mark table as occupied as order is placed
    if (selectedTableId) {
      setTables((prev) =>
        prev.map((t) => (t.id === selectedTableId ? { ...t, status: 'Occupied' } : t))
      );
    }

    clearCart();
    setNewOrderAlert(true); // alert owner dashboard of new live order
    return newOrderId;
  };

  const updateOrderStatus = (orderId: string, status: 'Pending' | 'Preparing' | 'Done') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    
    // If done, we can mark table as free
    const matchedOrder = orders.find((o) => o.id === orderId);
    if (matchedOrder && status === 'Done') {
      const ordTableId = matchedOrder.tableId;
      setTables((prev) =>
        prev.map((t) => (t.id === ordTableId ? { ...t, status: 'Free' } : t))
      );
    }
  };

  // Background Simulator: Adds a mock order every 30 seconds for real-time vibe
  const triggerMockIncomingOrder = () => {
    const randomClientNames = [
      'Jean Nepo', 'Marie Claire', 'Kevine Ganza', 'Danny Vumbi', 'Eric Mucyo', 'Alice Mugeni'
    ];
    const mockMains = menuItems.filter((i) => i.category === 'Mains');
    const mockDrinks = menuItems.filter((i) => i.category === 'Drinks');
    
    if (mockMains.length === 0 || mockDrinks.length === 0) return;

    const chosenMain = mockMains[Math.floor(Math.random() * mockMains.length)];
    const chosenDrink = mockDrinks[Math.floor(Math.random() * mockDrinks.length)];

    const randomTable = tables[Math.floor(Math.random() * tables.length)];
    const activeRestaurant = restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0];

    const orderItems = [
      { id: chosenMain.id, name: chosenMain.name, price: chosenMain.price, quantity: 1 },
      { id: chosenDrink.id, name: chosenDrink.name, price: chosenDrink.price, quantity: 2 },
    ];
    const total = chosenMain.price + (chosenDrink.price * 2);

    const clientName = randomClientNames[Math.floor(Math.random() * randomClientNames.length)];
    
    const simulatedOrder: Order = {
      id: generateUniqueOrderId(orders),
      tableId: randomTable?.id || 'Table-02',
      restaurantId: activeRestaurant.id,
      restaurantName: activeRestaurant.name,
      items: orderItems,
      total: total,
      status: 'Pending',
      date: new Date().toISOString(),
      clientName: clientName,
      clientPhone: `078${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    setOrders((prev) => [simulatedOrder, ...prev]);
    
    // Highlight table as occupied in system
    if (randomTable) {
      setTables((prev) =>
        prev.map((t) => (t.id === randomTable.id ? { ...t, status: 'Occupied' } : t))
      );
    }

    setNewOrderAlert(true);
    
    // Play sound simulation cue
    console.log('🔔 [Socket.IO Simulation] New incoming live order received!', simulatedOrder);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      // Trigger new mock incoming order every 30 seconds
      triggerMockIncomingOrder();
    }, 30000);

    return () => clearInterval(timer);
  }, [menuItems, tables, restaurants, activeRestaurantId]);

  return (
    <AppContext.Provider
      value={{
        restaurants,
        menuItems,
        tables,
        orders,
        staff,
        cart,
        clientUser,
        ownerUser,
        activeRestaurantId,
        selectedTableId,
        currentAppState,
        addRestaurant,
        updateMenuItemAvailability,
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        addTable,
        toggleTableStatus,
        addStaff,
        removeStaff,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        setClientUser,
        setOwnerUser,
        setActiveRestaurantId,
        setSelectedTableId,
        setCurrentAppState,
        placeOrder,
        updateOrderStatus,
        triggerMockIncomingOrder,
        newOrderAlert,
        setNewOrderAlert,
        companyName,
        companyLogo,
        brandCandidates,
        selectedBrandIndex,
        setSelectedBrandIndex,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

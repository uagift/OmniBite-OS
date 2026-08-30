import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Boxes, ShoppingCart, Menu as MenuIcon, Users, 
  MapPin, Plus, Check, Trash2, Edit2, Sliders, AlertTriangle, 
  Sparkles, ToggleLeft, ToggleRight, X, UserCheck, RefreshCw, BarChart2,
  LogOut, Palette
} from 'lucide-react';
import { DashboardTab, MenuItem, Table, StaffMember } from '../types';

export default function AdminDashboard() {
  const {
    menuItems,
    tables,
    orders,
    staff,
    ownerUser,
    setCurrentAppState,
    addMenuItem,
    editMenuItem,
    deleteMenuItem,
    updateMenuItemAvailability,
    addTable,
    toggleTableStatus,
    addStaff,
    removeStaff,
    updateOrderStatus,
    newOrderAlert,
    setNewOrderAlert,
    companyName,
    companyLogo,
    setOwnerUser,
    restaurants,
    addRestaurant,
    activeRestaurantId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Modals / Creating Forms state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Item Modal form states
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('10.00');
  const [itemCategory, setItemCategory] = useState('Mains');
  const [itemDescription, setItemDescription] = useState('');
  const [itemStock, setItemStock] = useState('20');
  const [itemImage, setItemImage] = useState('');

  // Tables form states
  const [showTableModal, setShowTableModal] = useState(false);
  const [newTableId, setNewTableId] = useState('');
  const [newTableLoc, setNewTableLoc] = useState('Standard Side');

  // Staff form states
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState<'Waiter' | 'Chef' | 'Manager'>('Waiter');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');

  // Helpers for calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeTablesCount = tables.filter((t) => t.status === 'Occupied').length;
  // Low stock is items with stock < 10
  const lowStockItems = menuItems.filter((item) => (item.stock !== undefined && item.stock < 10));

  // Handle Inventory Submit (Add or Edit)
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;

    const parsedPrice = parseFloat(itemPrice) || 0;
    const parsedStock = parseInt(itemStock) || 0;
    const defaultImg = itemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=250&q=80';

    if (editingItem) {
      editMenuItem({
        ...editingItem,
        name: itemName,
        price: parsedPrice,
        category: itemCategory,
        description: itemDescription,
        stock: parsedStock,
        image: defaultImg
      });
    } else {
      addMenuItem({
        id: `custom-item-${Date.now()}`,
        name: itemName,
        price: parsedPrice,
        category: itemCategory,
        description: itemDescription,
        isAvailable: true,
        stock: parsedStock,
        image: defaultImg
      });
    }

    // Reset fields & close
    setShowItemModal(false);
    setEditingItem(null);
    setItemName('');
    setItemPrice('10.00');
    setItemCategory('Mains');
    setItemDescription('');
    setItemStock('20');
    setItemImage('');
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(String(item.price));
    setItemCategory(item.category);
    setItemDescription(item.description);
    setItemStock(String(item.stock || 20));
    setItemImage(item.image);
    setShowItemModal(true);
  };

  // Add Table
  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableId) return;

    addTable({
      id: newTableId,
      location: newTableLoc,
      status: 'Free'
    });

    setNewTableId('');
    setNewTableLoc('Standard Side');
    setShowTableModal(false);
  };

  // Add Staff
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    addStaff({
      id: `S-${Math.floor(10 + Math.random() * 90)}`,
      name: staffName,
      role: staffRole,
      phone: staffPhone || '+250 788 123 456',
      email: staffEmail,
    });

    setStaffName('');
    setStaffRole('Waiter');
    setStaffPhone('');
    setStaffEmail('');
    setShowStaffModal(false);
  };

  const accentColor = ownerUser?.brandAccentColor || '#22C55E';

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col md:flex-row font-sans relative overflow-x-hidden text-left">
      
      {/* Dynamic CSS Overrides for Active Theme Customization */}
      <style>{`
        .text-\\[\\#22C55E\\] { color: ${accentColor} !important; }
        .bg-\\[\\#22C55E\\] { background-color: ${accentColor} !important; }
        .border-\\[\\#22C55E\\] { border-color: ${accentColor} !important; }
        .border-\\[\\#22C55E\\]\\/40 { border-color: ${accentColor}66 !important; }
        .shadow-\\[0_0_10px_rgba\\(34\\,197\\,94\\,0\\.1\\)\\] { box-shadow: 0 0 10px ${accentColor}1A !important; }
        .bg-\\[\\#1D5E3A\\] { background-color: ${accentColor}CC !important; }
        .shadow-\\[\\#22C55E\\]\\/10 { --tw-shadow-color: ${accentColor}1A !important; }
        .bg-\\[\\#123820\\] { background-color: ${accentColor}26 !important; border-color: ${accentColor}66 !important; }
        .bg-\\[\\#124225\\]\\/30 { background-color: ${accentColor}1F !important; }
        .border-\\[\\#22C55E\\]\\/30 { border-color: ${accentColor}4D !important; }
        .bg-\\[\\#22C55E\\]\\/15 { background-color: ${accentColor}26 !important; }
        .bg-\\[\\#22C55E\\]\\/10 { background-color: ${accentColor}1A !important; }
        .border-\\[\\#22C55E\\]\\/20 { border-color: ${accentColor}33 !important; }
        .hover\\:bg-\\[\\#1fbc59\\]:hover { background-color: ${accentColor}D9 !important; }
        .hover\\:bg-\\[\\#1EAB52\\]:hover { background-color: ${accentColor}D9 !important; }
        .focus\\:border-\\[\\#22C55E\\]:focus { border-color: ${accentColor} !important; }
      `}</style>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-64 shrink-0 bg-[#0C111C] border-r border-gray-900 flex flex-col justify-between p-6 h-screen sticky top-0 z-30 transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 hidden md:flex'
      }`}>
        <div className="space-y-8">
          
          {/* Logo Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#22C55E]/40 flex items-center justify-center bg-black/40 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
              <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left">
              <span className="font-bold text-xs tracking-widest text-[#22C55E] block uppercase">{companyName}</span>
              <span className="text-[8px] text-gray-400 tracking-wider">REST OWNER DASH</span>
            </div>
          </div>

          {/* Owner details card */}
          <div className="p-4 rounded-2xl bg-[#111827] border border-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 border-2 border-[#22C55E]/40 select-none">
              <img 
                className="w-full h-full object-cover" 
                src={ownerUser?.logo || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80'} 
                alt="Logo" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left min-w-0 flex-1">
              <span className="block text-xs font-extrabold text-white truncate">{ownerUser?.restaurantName || 'My Restaurant'}</span>
              <span className="block text-[9px] text-gray-400 truncate">{ownerUser?.email || 'owner@domain.com'}</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 text-left select-none">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'inventory', label: 'Inventory', icon: Boxes },
              { id: 'orders', label: 'Orders (Live)', icon: ShoppingCart, countBadge: orders.filter(o => o.status === 'Pending').length },
              { id: 'menu', label: 'Menu Toggles', icon: MenuIcon },
              { id: 'tables', label: 'Tables Map', icon: MapPin },
              { id: 'staff', label: 'Staff Hub', icon: Users },
              { id: 'branding', label: 'Branding & Theme', icon: Palette },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1D5E3A] text-white shadow-[#22C55E]/10 shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </div>
                  {/* Badge */}
                  {item.countBadge && item.countBadge > 0 ? (
                    <span className="bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full ring-2 ring-black">
                      {item.countBadge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Support, Settings and Logout */}
        <div className="space-y-2 pt-4 border-t border-gray-900 select-none text-left">
          <button
            onClick={() => {
              setOwnerUser({
                ...ownerUser,
                isLoggedIn: false,
              });
              setCurrentAppState('landing');
            }}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-black text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut size={15} />
            <span>Log Out & Return Home</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER FOR SIDEBAR TOGGLE */}
      <div className="md:hidden w-full bg-[#0C111C] border-b border-gray-900 py-3.5 px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#22C55E]/40 flex items-center justify-center bg-black/40">
            <span className="text-[#22C55E] text-xs font-black">S</span>
          </div>
          <span className="font-bold text-xs text-white tracking-wider">{ownerUser?.restaurantName || 'Owner'}</span>
        </div>

        {/* Sidebar trigger */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 px-3 text-2xs uppercase tracking-wide border border-gray-800 bg-[#111827] text-gray-400 hover:text-white rounded-lg cursor-pointer"
        >
          {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      {/* MAIN CONTAINER PANEL */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen relative p-4 sm:p-6 lg:p-8">
        
        {/* Dynamic header summary statistics alert */}
        {newOrderAlert && (
          <div className="mb-6 bg-[#123820] border border-[#22C55E]/40 p-4 rounded-2xl flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#22C55E]" size={15} />
              <span className="font-extrabold text-white">Live System Update: New incoming order placed directly from Diner Table!</span>
            </div>
            <button 
              onClick={() => {
                setNewOrderAlert(false);
                setActiveTab('orders');
              }}
              className="bg-[#22C55E] text-black font-black uppercase text-[10px] px-3.5 py-1.5 rounded-lg hover:bg-white cursor-pointer"
            >
              Analyze Live Orders
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD HOME OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Cards Overview row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Today Orders */}
              <div className="bg-[#0C111C] border border-gray-900 rounded-2xl p-5 hover:border-gray-850 transition-all text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] flex items-center justify-center shadow-sm">
                  <ShoppingCart size={22} />
                </div>
                <div className="leading-tight">
                  <span className="block text-2xl font-black text-white font-mono">{orders.length}</span>
                  <span className="block text-4xs uppercase tracking-wider text-gray-500 font-extrabold mt-1">Today's Orders</span>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-[#0C111C] border border-gray-900 rounded-2xl p-5 hover:border-gray-850 transition-all text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-sm">
                  <BarChart2 size={22} />
                </div>
                <div className="leading-tight">
                  <span className="block text-2xl font-black text-white font-mono">${totalRevenue.toFixed(2)}</span>
                  <span className="block text-4xs uppercase tracking-wider text-gray-500 font-extrabold mt-1">Earnings Revenue</span>
                </div>
              </div>

              {/* Active Tables Map */}
              <div className="bg-[#0C111C] border border-gray-900 rounded-2xl p-5 hover:border-gray-850 transition-all text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-sm">
                  <MapPin size={22} />
                </div>
                <div className="leading-tight">
                  <span className="block text-2xl font-black text-white font-mono">{activeTablesCount} / {tables.length}</span>
                  <span className="block text-4xs uppercase tracking-wider text-gray-500 font-extrabold mt-1">Active occupied Tables</span>
                </div>
              </div>

              {/* Low stock indicators */}
              <div className="bg-[#0C111C] border border-gray-900 rounded-2xl p-5 hover:border-gray-850 transition-all text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shadow-sm">
                  <AlertTriangle size={22} />
                </div>
                <div className="leading-tight">
                  <span className="block text-2xl font-black text-white font-mono">{lowStockItems.length}</span>
                  <span className="block text-4xs uppercase tracking-wider text-gray-500 font-extrabold mt-1">Low Storage alert items</span>
                </div>
              </div>
            </div>

            {/* Dashboard Sub columns: Alerts & active lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3">
              
              {/* Low stock alerts List */}
              <div className="lg:col-span-6 bg-[#0C111C] border border-gray-900 p-6 rounded-2xl text-left">
                <h4 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-red-500" size={16} />
                  <span>Low Storage Alerts ({lowStockItems.length})</span>
                </h4>
                {lowStockItems.length === 0 ? (
                  <p className="text-xs text-gray-500">Every storage item has sufficient stock levels safely.</p>
                ) : (
                  <div className="space-y-3.5">
                    {lowStockItems.map((it) => (
                      <div key={it.id} className="flex justify-between items-center p-3 border border-red-950/20 rounded-xl bg-[#111827]">
                        <div className="flex items-center gap-3">
                          <img className="w-9 h-9 object-cover rounded-lg shrink-0" src={it.image} alt={it.name} referrerPolicy="no-referrer" />
                          <div>
                            <span className="block text-xs font-bold text-white leading-none">{it.name}</span>
                            <span className="block text-[10px] text-gray-500 mt-1 uppercase font-semibold">{it.category}</span>
                          </div>
                        </div>

                        <span className="bg-red-500/15 text-red-400 border border-red-500/20 font-mono text-3xs font-extrabold px-3 py-1 rounded-full">
                          Only {it.stock} Left!
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick statistics tracker info representing sales trajectory */}
              <div className="lg:col-span-6 bg-[#0C111C] border border-gray-900 p-6 rounded-2xl text-left">
                <h4 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2 mb-6">
                  <Boxes className="text-[#22C55E]" size={16} />
                  <span>Store Statistics & General Operations</span>
                </h4>

                <div className="space-y-4 text-xs font-medium">
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2.5">
                    <span className="text-gray-400">Total Catalog Products:</span>
                    <span className="font-bold text-white">{menuItems.length} Products</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2.5">
                    <span className="text-gray-400">Current Staff Count:</span>
                    <span className="font-bold text-white">{staff.length} Active Staff</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-900 pb-2.5">
                    <span className="text-gray-400">Available Seating Tables:</span>
                    <span className="font-bold text-[#22C55E]">{tables.filter(t => t.status === 'Free').length} tables free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Estimated Total Revenue Stream:</span>
                    <span className="font-extrabold text-[#22C55E] text-sm">${totalRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT SECTION */}
        {activeTab === 'inventory' && (
          <div className="bg-[#0C111C] border border-gray-900 rounded-[24px] p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#22C55E]">Inventory Ledger</h3>
                <p className="text-xs text-gray-400 mt-1">Add, edit stock limits and delete product catalog rows.</p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setItemName('');
                  setItemPrice('10.00');
                  setItemCategory('Mains');
                  setItemDescription('');
                  setItemStock('20');
                  setItemImage('');
                  setShowItemModal(true);
                }}
                className="bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus size={15} />
                <span>Add New Product Item</span>
              </button>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-400">
                <thead className="bg-[#111827]/50 uppercase tracking-widest text-[9px] font-black text-gray-500 border-b border-gray-900">
                  <tr>
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Standard Price</th>
                    <th className="py-3 px-4">Stock Quantity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Catalog Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-900 hover:bg-[#111827]/20 transition-all">
                      <td className="py-4 px-4 font-bold text-white font-sans max-w-[200px]">
                        <div className="flex items-center gap-3">
                          <img className="w-10 h-10 rounded-lg object-cover shrink-0 select-none" src={item.image} alt="Dish" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <span className="block font-bold truncate text-white leading-tight">{item.name}</span>
                            <span className="block font-light text-[10px] mt-0.5 text-gray-500 truncate leading-snug">{item.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono">{item.category}</td>
                      <td className="py-4 px-4 font-mono text-[#22C55E]">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-4 font-mono">{item.stock !== undefined ? item.stock : 25} units</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 text-4xs font-black uppercase rounded-full border ${
                          item.isAvailable 
                            ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/15 border-red-500/20 text-red-400'
                        }`}>
                          {item.isAvailable ? 'In Stock' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Edit button */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1 px-3 text-2xs font-extrabold border border-gray-800 bg-[#111827] text-gray-300 hover:text-[#22C55E] rounded-md transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          
                          {/* Delete Action */}
                          <button
                            onClick={() => {
                              if (confirm('Delete this menu product?')) {
                                deleteMenuItem(item.id);
                              }
                            }}
                            className="p-1.5 border border-gray-800 bg-red-950/20 hover:bg-red-950/50 text-red-400 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ACTIVE ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-[#0C111C] border border-gray-900 rounded-[24px] p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-black text-white">Live Diner Orders (Active Stream)</h3>
                <p className="text-xs text-gray-400 mt-1">Orders placed recently by clients flash for attention. Updates sync dynamically.</p>
              </div>

              {/* ACTION: ADD CLIENT Redirect! */}
              <button
                onClick={() => setCurrentAppState('client_register')}
                className="bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="Create a New Diner Client registration directly"
              >
                <Plus size={15} />
                <span>Add Client User</span>
              </button>
            </div>

            {/* Orders Table list */}
            {orders.length === 0 ? (
              <p className="text-xs text-center py-12 text-gray-500">Wait for Diner orders to arrive in system stream.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-gray-400">
                  <thead className="bg-[#111827]/50 uppercase tracking-widest text-[9px] font-black text-gray-500 border-b border-gray-900">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Diner Seat</th>
                      <th className="py-3.5 px-4">Ordered Items</th>
                      <th className="py-3.5 px-4">Total Price</th>
                      <th className="py-3.5 px-4">Client Contact</th>
                      <th className="py-3.5 px-4">Live State Status</th>
                      <th className="py-3.5 px-4">Command Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      // Check if placed in the last 60 seconds to flash highlight animation!
                      const isNew = Date.now() - new Date(o.date).getTime() < 60000;
                      return (
                        <tr 
                          key={o.id} 
                          className={`border-b border-gray-900 hover:bg-[#111827]/10 transition-all ${
                            isNew ? 'bg-[#124225]/30 animate-pulse border-[#22C55E]/30' : ''
                          }`}
                        >
                          <td className="py-4 px-4">
                            <span className="block font-bold text-white font-mono">{o.id}</span>
                            <span className="block text-2xs text-gray-500 mt-1 font-mono">
                              {new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-[#111827] border border-gray-800 px-3 py-1 text-3xs font-black text-white rounded-full">
                              {o.tableId}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-sans text-gray-300">
                            <ul className="space-y-0.5 leading-snug">
                              {o.items.map((it, idx) => (
                                <li key={idx} className="line-clamp-1">
                                  {it.name} <span className="text-[#22C55E] text-[10px] font-bold">x{it.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="py-4 px-4 font-mono text-[#22C55E] font-extrabold">${o.total.toFixed(2)}</td>
                          <td className="py-4 px-4">
                            <span className="block font-bold text-white">{o.clientName || 'Walk-in Client'}</span>
                            <span className="block text-2xs text-gray-500 mt-0.5 font-mono">{o.clientPhone || '0780000000'}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 text-4xs font-black uppercase rounded-full border ${
                              o.status === 'Pending'
                                ? 'bg-amber-500/15 border-amber-500/20 text-amber-500'
                                : o.status === 'Preparing'
                                ? 'bg-blue-500/15 border-blue-500/20 text-[#22D55E]'
                                : 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400'
                            }`}>
                              {o.status === 'Pending' ? 'Pending' : o.status === 'Preparing' ? 'Preparing' : 'Served (Done)'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {/* Update dropdown or action buttons */}
                            <div className="flex items-center gap-1.5 justify-start">
                              {o.status === 'Pending' ? (
                                <button
                                  onClick={() => updateOrderStatus(o.id, 'Preparing')}
                                  className="bg-blue-500 hover:bg-blue-600 text-black font-extrabold text-3xs px-2.5 py-1 rounded-md transition-all cursor-pointer"
                                >
                                  Mark Preparing
                                </button>
                              ) : o.status === 'Preparing' ? (
                                <button
                                  onClick={() => updateOrderStatus(o.id, 'Done')}
                                  className="bg-[#22C55E] hover:bg-[#1EAB52] text-black font-extrabold text-3xs px-2.5 py-1 rounded-md transition-all cursor-pointer"
                                >
                                  Mark Done
                                </button>
                              ) : (
                                <span className="text-emerald-500 text-3xs font-extrabold flex items-center gap-1">
                                  <Check size={10} strokeWidth={3} /> Completed
                                </span>
                              )}
                              
                              {/* Quick toggle dropdown just in case they need to revert */}
                              <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                                className="bg-[#111827] border border-gray-800 text-gray-400 text-3xs p-1 rounded-md cursor-pointer focus:outline-none"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Done">Done</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MENU STOREFRONT AVAILABILITY TOGGLES */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="bg-[#0C111C] border border-gray-900 rounded-[24px] p-6 text-left">
              <h3 className="text-xl font-black text-white">Menu Availability Switches</h3>
              <p className="text-xs text-gray-400 mt-1">Enable or disable specific items dynamically. Disabled products hide on the Diner Menu scan.</p>
            </div>

            {/* Menu catalogue preview list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => {
                return (
                  <div 
                    key={item.id}
                    className="bg-[#0C111C] border border-gray-900 p-4 rounded-2xl flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img className="w-12 h-12 object-cover rounded-xl shrink-0 select-none" src={item.image} alt={item.name} referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <span className="block font-bold text-xs text-white truncate">{item.name}</span>
                        <span className="block text-[10px] text-gray-500 font-mono mt-0.5">${item.price.toFixed(2)} • {item.category}</span>
                      </div>
                    </div>

                    {/* Toggle Slider Switch */}
                    <button
                      onClick={() => updateMenuItemAvailability(item.id, !item.isAvailable)}
                      className="text-[#22C55E] hover:text-white transition-colors cursor-pointer"
                      title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    >
                      {item.isAvailable ? (
                        <div className="flex items-center gap-1.5 text-[#22C55E] text-2xs font-extrabold uppercase">
                          <span>Visible</span>
                          <ToggleRight size={30} strokeWidth={1.5} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-600 text-2xs font-extrabold uppercase">
                          <span>Hidden</span>
                          <ToggleLeft size={30} strokeWidth={1.5} className="opacity-60" />
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: TABLES LAYOUT SECTION */}
        {activeTab === 'tables' && (
          <div className="bg-[#0C111C] border border-gray-900 rounded-[24px] p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-black text-[#22C55E]">Physical Diner Tables Map</h3>
                <p className="text-xs text-gray-400 mt-1">Configure layout identifiers and mark table occupied/free manually.</p>
              </div>

              <button
                onClick={() => setShowTableModal(true)}
                className="bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus size={15} />
                <span>Add Seating Table</span>
              </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((t) => (
                <div 
                  key={t.id}
                  className="bg-[#111827] border border-gray-900 p-5 rounded-2xl flex items-center justify-between select-none"
                >
                  <div className="text-left space-y-1">
                    <span className="block font-bold text-sm text-white">{t.id}</span>
                    <span className="block text-[10px] text-gray-500 font-medium">{t.location}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-4xs font-black uppercase text-center ${
                      t.status === 'Free' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {t.status}
                    </span>

                    <button
                      onClick={() => toggleTableStatus(t.id)}
                      className="px-2.5 py-1 text-4xs font-bold border border-gray-800 hover:border-gray-700 bg-gray-900 text-gray-400 hover:text-white rounded-md cursor-pointer transition-colors"
                    >
                      Toggle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STAFF MEMBERS MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="bg-[#0C111C] border border-gray-905 rounded-[24px] p-6 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-5 mb-6">
              <div>
                <h3 className="text-lg font-black text-white">Restaurant Wait Staff</h3>
                <p className="text-xs text-gray-400 mt-1">Assign roles (Waiter, Chef, Manager) and track contact cards directories.</p>
              </div>

              <button
                onClick={() => setShowStaffModal(true)}
                className="bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md flex items-center gap-1.5 transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <Plus size={15} />
                <span>Add Staff Member</span>
              </button>
            </div>

            {/* Grid listings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((st) => (
                <div 
                  key={st.id}
                  className="bg-[#111827] border border-gray-900 p-5 rounded-2xl flex flex-col justify-between text-left h-44 hover:border-gray-850 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white block">{st.name}</span>
                      <span className="bg-[#22C55E]/15 text-[#22C55E] text-4xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {st.role}
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-500 font-mono block pt-1">Code ID: {st.id}</span>
                  </div>

                  <div className="space-y-1 pt-3 border-t border-gray-950/60 mt-3 text-4xs text-gray-400 font-medium">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-sans text-gray-300">{st.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-sans text-gray-300">{st.phone}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeStaff(st.id)}
                    className="mt-3 bg-red-950/15 hover:bg-red-950/40 text-red-400 text-3xs font-extrabold py-2 rounded-lg cursor-pointer transition-colors text-center w-full"
                  >
                    Remove Staff Member
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BRANDING & THEME CUSTOMIZATION */}
        {activeTab === 'branding' && (
          <div className="bg-[#0C111C] border border-gray-905 rounded-[24px] p-6 text-left">
            <div className="border-b border-gray-900 pb-5 mb-6">
              <h3 className="text-lg font-black text-white">Branding & Theme Customizer</h3>
              <p className="text-xs text-gray-400 mt-1">Configure your active digital identity. Upload your restaurant's custom logo and choose your high-contrast brand accent color to style the diner mobile app.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Settings Form Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Custom Logo Customization */}
                <div className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400">Restaurant Logo Upload</label>
                  <div className="flex items-center gap-4 bg-[#111827] border border-gray-800 p-4 rounded-2xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-800 bg-black/40 flex items-center justify-center shrink-0">
                      <img 
                        src={ownerUser?.logo || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80'} 
                        alt="Current Logo" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="text-[11px] text-gray-400">Select an image file from your device to upload instantly as a base64 asset:</p>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Real File Input styled as upload button */}
                        <label className="bg-[#1D5E3A] hover:bg-[#1fbc59] text-white font-extrabold text-[11px] px-3 py-2 rounded-lg cursor-pointer transition-colors text-center inline-block">
                          <span>Choose Image File...</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const resultStr = reader.result as string;
                                  // 1. Update ownerUser on context
                                  setOwnerUser({
                                    ...ownerUser,
                                    logo: resultStr
                                  });
                                  // 2. Sync to active restaurant in context list
                                  const currentRestId = activeRestaurantId || 'rest-active-setup';
                                  const found = restaurants.find(r => r.id === currentRestId) || restaurants[0];
                                  addRestaurant({
                                    ...found,
                                    logo: resultStr
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                        
                        <span className="text-[11px] text-gray-500 self-center font-mono py-1 truncate">
                          Max file size: 2MB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preset Custom Logo Option */}
                  <div className="space-y-2 pt-1">
                    <p className="text-gray-400 text-[11px] font-semibold">Or enter any custom Web URL option directly:</p>
                    <input 
                      type="url"
                      value={ownerUser?.logo || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOwnerUser({
                          ...ownerUser,
                          logo: val
                        });
                        const currentRestId = activeRestaurantId || 'rest-active-setup';
                        const found = restaurants.find(r => r.id === currentRestId) || restaurants[0];
                        addRestaurant({
                          ...found,
                          logo: val
                        });
                      }}
                      placeholder="e.g. https://domain.com/my-logo.png"
                      className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 text-xs border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                    />
                  </div>
                </div>

                {/* Theme Customization Color Picker */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-400">Primary Theme Accent Color</label>
                  <div className="bg-[#111827] border border-gray-800 p-4 rounded-2xl space-y-4">
                    <p className="text-[11px] text-gray-400">Select an elegant theme preset, or choose any color using the dynamic palette:</p>
                    
                    <div className="flex flex-wrap gap-2.5">
                      {[
                        { hex: '#22C55E', name: 'Emerald Green' },
                        { hex: '#EC4899', name: 'Rose Red' },
                        { hex: '#F59E0B', name: 'Amber Gold' },
                        { hex: '#3B82F6', name: 'Sapphire Blue' },
                        { hex: '#8B5CF6', name: 'Amethyst Purple' },
                        { hex: '#FF5733', name: 'Coral Flare' },
                        { hex: '#00F0FF', name: 'Cyan Neon' }
                      ].map((clr) => {
                        const isSelected = (ownerUser?.brandAccentColor || '#22C55E') === clr.hex;
                        return (
                          <button
                            key={clr.hex}
                            type="button"
                            onClick={() => {
                              setOwnerUser({
                                ...ownerUser,
                                brandAccentColor: clr.hex
                              });
                              const currentRestId = activeRestaurantId || 'rest-active-setup';
                              const found = restaurants.find(r => r.id === currentRestId) || restaurants[0];
                              addRestaurant({
                                ...found,
                                brandAccentColor: clr.hex
                              });
                            }}
                            className={`px-3 py-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected 
                                ? 'text-white border-white bg-white/5 shadow-md' 
                                : 'text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                            }`}
                          >
                            <div 
                              className="w-3.5 h-3.5 rounded-full border border-black/45 shadow" 
                              style={{ backgroundColor: clr.hex }}
                            />
                            <span>{clr.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Palette input */}
                    <div className="flex items-center gap-3.5 border-t border-gray-900 pt-3.5">
                      <div className="relative shrink-0">
                        <input 
                          type="color"
                          value={ownerUser?.brandAccentColor || '#22C55E'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOwnerUser({
                              ...ownerUser,
                              brandAccentColor: val
                            });
                            const currentRestId = activeRestaurantId || 'rest-active-setup';
                            const found = restaurants.find(r => r.id === currentRestId) || restaurants[0];
                            addRestaurant({
                              ...found,
                              brandAccentColor: val
                            });
                          }}
                          className="w-10 h-10 rounded-xl border border-gray-800 bg-transparent cursor-pointer overflow-hidden opacity-100"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-semibold text-white">Custom hexadecimal shade:</p>
                        <input 
                          type="text"
                          maxLength={7}
                          value={ownerUser?.brandAccentColor || '#22C55E'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOwnerUser({
                              ...ownerUser,
                              brandAccentColor: val
                            });
                            const currentRestId = activeRestaurantId || 'rest-active-setup';
                            const found = restaurants.find(r => r.id === currentRestId) || restaurants[0];
                            addRestaurant({
                              ...found,
                              brandAccentColor: val
                            });
                          }}
                          className="bg-transparent text-gray-300 font-mono text-xs uppercase focus:outline-none focus:text-white mt-0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Mock Showcase Column */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                <div className="border border-gray-850 bg-[#07090D] rounded-3xl p-5 text-left space-y-5 shadow-inner">
                  <span className="text-[10px] font-black uppercase bg-[#22C55E]/10 text-brand-accent border border-[#22C55E]/20 px-2.5 py-1 rounded-full tracking-wider" style={{ color: ownerUser?.brandAccentColor || '#22C55E' }}>
                    Live Diner Experience Mockup
                  </span>
                  <p className="text-[11px] text-gray-400">Diners instantly view this beautiful responsive styling theme when scanned at their tableside:</p>
                  
                  {/* Framed Mini Client View */}
                  <div className="bg-[#0C1220] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
                    {/* Top Bar Indicator */}
                    <div className="h-6 w-full bg-black/60 border-b border-gray-900 flex items-center px-4 justify-between">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <div className="text-[9px] font-mono text-gray-500">Live Client View Mode</div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    {/* Simulated Content */}
                    <div className="p-4 space-y-4">
                      {/* Header with Custom Logo */}
                      <div className="flex gap-3 items-center">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-gray-800 bg-black/40 shadow-inner flex items-center justify-center shrink-0">
                          <img 
                            src={ownerUser?.logo || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80'} 
                            alt="Current Logo" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-[#ffffff] text-xs">
                            {ownerUser?.restaurantName || 'Kigali Bites'}
                          </h4>
                          <p className="text-[9px] text-[#9CA3AF]">
                            {ownerUser?.location || 'Nyarugenge, Kigali'}
                          </p>
                        </div>
                      </div>

                      {/* Spaced Item card with accent highlights */}
                      <div className="bg-[#111827] border border-gray-900 rounded-xl p-3 flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-gray-900 overflow-hidden shrink-0">
                          <img src="https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=150&q=80" alt="Item" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h5 className="font-bold text-white text-[11px] truncate">Akabenzi Pork Special</h5>
                            <p className="text-[9px] text-gray-500 truncate mt-0.5">Glazed sweet-savory tender pork chunk squares</p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="font-mono text-[10px] font-bold" style={{ color: ownerUser?.brandAccentColor || '#22C55E' }}>
                              $15.00
                            </span>
                            <button 
                              type="button"
                              className="text-black text-[9px] font-semibold px-2 py-0.5 rounded-md"
                              style={{ backgroundColor: ownerUser?.brandAccentColor || '#22C55E' }}
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Mobile View CTA Button */}
                      <button
                        type="button"
                        className="w-full font-black text-[10px] py-2.5 rounded-lg text-black text-center shadow transition-all duration-300 transform"
                        style={{ backgroundColor: ownerUser?.brandAccentColor || '#22C55E' }}
                      >
                        PROCEED TO CHECKOUT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD OR EDIT PRODUCT MENU ITEM */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowItemModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          
          <div className="relative bg-[#0C111C] border border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-5">
              <h4 className="font-bold text-base text-white">{editingItem ? 'Edit Product Item' : 'Add New Product Item'}</h4>
              <button onClick={() => setShowItemModal(false)} className="p-1 rounded-full bg-[#111827] border border-gray-800 text-gray-400 hover:text-white cursor-pointer"><X size={15} /></button>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-400 mb-1">Item Title Name</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Traditional Spicy Brochettes"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Stock Cap Units</label>
                  <input
                    type="number"
                    required
                    value={itemStock}
                    onChange={(e) => setItemStock(e.target.value)}
                    className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Product Category</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                >
                  <option value="Mains">Mains (Meals)</option>
                  <option value="Drinks">Drinks (Beverages)</option>
                  <option value="Desserts">Desserts (Sweets)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Visual Image URL</label>
                <input
                  type="url"
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Recipe Description</label>
                <textarea
                  required
                  rows={3}
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Summarize delicious recipe spices detail"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E] placeholder-gray-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold py-3 rounded-lg cursor-pointer text-center text-xs shadow-md"
              >
                {editingItem ? 'Save Updates' : 'Publish Product to Menu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TABLES */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowTableModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          
          <div className="relative bg-[#0C111C] border border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-5">
              <h4 className="font-bold text-base text-white">Add Seating Table</h4>
              <button onClick={() => setShowTableModal(false)} className="p-1 rounded-full bg-[#111827] border border-gray-800 text-gray-400 hover:text-white cursor-pointer"><X size={15} /></button>
            </div>

            <form onSubmit={handleTableSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-400 mb-1">Table Code (ID Name)</label>
                <input
                  type="text"
                  required
                  value={newTableId}
                  onChange={(e) => setNewTableId(e.target.value)}
                  placeholder="e.g. Table-12"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 text-left">Spatial Location Label</label>
                <input
                  type="text"
                  required
                  value={newTableLoc}
                  onChange={(e) => setNewTableLoc(e.target.value)}
                  placeholder="e.g. Quiet Balcony View"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold py-3 rounded-lg cursor-pointer text-center text-xs shadow-md"
              >
                Register Diners Table
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD STAFF MEMBER */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowStaffModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          
          <div className="relative bg-[#0C111C] border border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl z-10 text-left">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3 mb-5">
              <h4 className="font-bold text-base text-white">Add Staff Member</h4>
              <button onClick={() => setShowStaffModal(false)} className="p-1 rounded-full bg-[#111827] border border-gray-800 text-gray-400 hover:text-white cursor-pointer"><X size={15} /></button>
            </div>

            <form onSubmit={handleStaffSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-400 mb-1">Full Member Name</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Chantal Uwimbabazi"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Staff Access Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                >
                  <option value="Waiter">Waiter (Floor Manager)</option>
                  <option value="Chef">Chef (Kitchen Specialist)</option>
                  <option value="Manager">Manager (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="e.g. +250 788 000 000"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. chantal@supamenu.com"
                  className="w-full bg-[#111827] text-white rounded-lg px-3.5 py-2 border border-gray-800 focus:outline-none focus:border-[#22C55E]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#22C55E] hover:bg-[#1fbc59] text-black font-extrabold py-3 rounded-lg cursor-pointer text-center text-xs shadow-md"
              >
                Enroll Staff Worker
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

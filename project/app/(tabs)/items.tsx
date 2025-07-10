import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useData, Item } from '@/context/DataContext';
import { Plus, Search, CreditCard as Edit, Trash2, Package, DollarSign, Percent, Hash } from 'lucide-react-native';
import ItemForm from '@/components/ItemForm';

export default function ItemsScreen() {
  const { items, deleteItem } = useData();
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.itemCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(itemId) },
      ]
    );
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleFormClose = () => {
    setShowItemForm(false);
    setEditingItem(null);
  };

  const calculateProfit = (salePrice: number, purchasePrice: number, discount: number) => {
    const discountedPrice = salePrice - (salePrice * discount / 100);
    return discountedPrice - purchasePrice;
  };

  const calculateProfitMargin = (salePrice: number, purchasePrice: number, discount: number) => {
    const discountedPrice = salePrice - (salePrice * discount / 100);
    const profit = discountedPrice - purchasePrice;
    return discountedPrice > 0 ? (profit / discountedPrice) * 100 : 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Items</Text>
          <Text style={styles.subtitle}>Manage your inventory</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowItemForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search items by name or code..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No items found' : 'No items yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Add your first item to get started'
              }
            </Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const profit = calculateProfit(item.salePrice, item.purchasePrice, item.discount);
            const profitMargin = calculateProfitMargin(item.salePrice, item.purchasePrice, item.discount);
            const finalPrice = item.salePrice - (item.salePrice * item.discount / 100);
            const gstAmount = (finalPrice * item.gstTax) / 100;
            const totalPrice = finalPrice + gstAmount;

            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCode}>Code: {item.itemCode}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditItem(item)}
                    >
                      <Edit size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.itemDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Hash size={16} color="#6B7280" />
                      <Text style={styles.detailLabel}>Units</Text>
                      <Text style={styles.detailValue}>{item.units}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign size={16} color="#10B981" />
                      <Text style={styles.detailLabel}>Sale Price</Text>
                      <Text style={styles.detailValue}>${item.salePrice}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Percent size={16} color="#F59E0B" />
                      <Text style={styles.detailLabel}>Discount</Text>
                      <Text style={styles.detailValue}>{item.discount}%</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign size={16} color="#EF4444" />
                      <Text style={styles.detailLabel}>Purchase</Text>
                      <Text style={styles.detailValue}>${item.purchasePrice}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Percent size={16} color="#3B82F6" />
                      <Text style={styles.detailLabel}>GST</Text>
                      <Text style={styles.detailValue}>{item.gstTax}%</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <DollarSign size={16} color="#8B5CF6" />
                      <Text style={styles.detailLabel}>Final Price</Text>
                      <Text style={styles.detailValue}>${totalPrice.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.profitSection}>
                  <View style={styles.profitItem}>
                    <Text style={styles.profitLabel}>Profit per unit</Text>
                    <Text style={[styles.profitValue, { color: profit >= 0 ? '#10B981' : '#EF4444' }]}>
                      ${profit.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.profitItem}>
                    <Text style={styles.profitLabel}>Profit margin</Text>
                    <Text style={[styles.profitValue, { color: profitMargin >= 0 ? '#10B981' : '#EF4444' }]}>
                      {profitMargin.toFixed(1)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.stockIndicator}>
                  <View style={[
                    styles.stockBadge,
                    item.units > 10 ? styles.inStock : 
                    item.units > 0 ? styles.lowStock : styles.outOfStock
                  ]}>
                    <Text style={[
                      styles.stockText,
                      item.units > 10 ? styles.inStockText : 
                      item.units > 0 ? styles.lowStockText : styles.outOfStockText
                    ]}>
                      {item.units > 10 ? 'In Stock' : 
                       item.units > 0 ? 'Low Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {showItemForm && (
        <ItemForm
          item={editingItem}
          onClose={handleFormClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  itemDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  profitSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  profitItem: {
    alignItems: 'center',
  },
  profitLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  profitValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  stockIndicator: {
    alignItems: 'flex-end',
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inStock: {
    backgroundColor: '#DCFCE7',
  },
  lowStock: {
    backgroundColor: '#FEF3C7',
  },
  outOfStock: {
    backgroundColor: '#FEE2E2',
  },
  stockText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  inStockText: {
    color: '#16A34A',
  },
  lowStockText: {
    color: '#D97706',
  },
  outOfStockText: {
    color: '#DC2626',
  },
});
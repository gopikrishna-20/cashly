import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useData } from '@/context/DataContext';
import { useState } from 'react';
import { ArrowLeft, Download, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react-native';
import { router } from 'expo-router';
import DateRangePicker from '@/components/DateRangePicker';

export default function ReportsScreen() {
  const { orders, expenses, getFilteredData } = useData();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredData = getFilteredData(startDate || undefined, endDate || undefined);
  const totalRevenue = filteredData.orders.reduce((sum, order) => sum + order.amount, 0);
  const totalExpenses = filteredData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalRevenue - totalExpenses;

  const paidOrders = filteredData.orders.filter(order => order.status === 'paid');
  const pendingOrders = filteredData.orders.filter(order => order.status === 'pending');
  const overdueOrders = filteredData.orders.filter(order => order.status === 'overdue');

  const expensesByCategory = filteredData.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const generateReport = () => {
    // In a real app, this would generate a PDF or export data
    alert('Report generation feature coming soon!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Sales Report</Text>
          <Text style={styles.subtitle}>
            {startDate && endDate 
              ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : 'All time'
            }
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton} onPress={generateReport}>
            <Download size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {(startDate && endDate) && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            Filtered data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={styles.clearFilter}>Clear filter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.revenueCard]}>
            <DollarSign size={24} color="#10B981" />
            <Text style={styles.summaryValue}>${totalRevenue.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Revenue</Text>
          </View>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <TrendingDown size={24} color="#EF4444" />
            <Text style={styles.summaryValue}>${totalExpenses.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
          </View>
          <View style={[styles.summaryCard, styles.profitCard]}>
            <TrendingUp size={24} color={profit >= 0 ? '#10B981' : '#EF4444'} />
            <Text style={[styles.summaryValue, { color: profit >= 0 ? '#10B981' : '#EF4444' }]}>
              ${Math.abs(profit).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>{profit >= 0 ? 'Profit' : 'Loss'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>Orders Breakdown</Text>
        <View style={styles.breakdownGrid}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownValue}>{paidOrders.length}</Text>
            <Text style={styles.breakdownLabel}>Paid Orders</Text>
            <Text style={styles.breakdownAmount}>
              ${paidOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownValue}>{pendingOrders.length}</Text>
            <Text style={styles.breakdownLabel}>Pending Orders</Text>
            <Text style={styles.breakdownAmount}>
              ${pendingOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownValue}>{overdueOrders.length}</Text>
            <Text style={styles.breakdownLabel}>Overdue Orders</Text>
            <Text style={styles.breakdownAmount}>
              ${overdueOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.expensesSection}>
        <Text style={styles.sectionTitle}>Expenses by Category</Text>
        {Object.entries(expensesByCategory).map(([category, amount]) => (
          <View key={category} style={styles.categoryItem}>
            <Text style={styles.categoryName}>{category}</Text>
            <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Detailed Orders</Text>
        {filteredData.orders.map((order) => (
          <View key={order.id} style={styles.orderItem}>
            <View>
              <Text style={styles.orderClient}>{order.clientName}</Text>
              <Text style={styles.orderInvoice}>{order.invoiceNumber}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderAmount}>${order.amount.toLocaleString()}</Text>
              <View style={[styles.orderStatus, styles[`${order.status}Status`]]}>
                <Text style={[styles.orderStatusText, styles[`${order.status}StatusText`]]}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {showDatePicker && (
        <DateRangePicker
          onSelect={handleDateRangeSelect}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
  },
  downloadButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 24,
    padding: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
  },
  clearFilter: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  summarySection: {
    margin: 24,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  revenueCard: {
    borderTopWidth: 3,
    borderTopColor: '#10B981',
  },
  expenseCard: {
    borderTopWidth: 3,
    borderTopColor: '#EF4444',
  },
  profitCard: {
    borderTopWidth: 3,
    borderTopColor: '#3B82F6',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  ordersSection: {
    margin: 24,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
    flex: 1,
  },
  breakdownValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  breakdownAmount: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginTop: 2,
  },
  expensesSection: {
    margin: 24,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  categoryAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  detailsSection: {
    margin: 24,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderClient: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  orderInvoice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  orderStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  paidStatus: {
    backgroundColor: '#DCFCE7',
  },
  paidStatusText: {
    color: '#16A34A',
  },
  pendingStatus: {
    backgroundColor: '#FEF3C7',
  },
  pendingStatusText: {
    color: '#D97706',
  },
  overdueStatus: {
    backgroundColor: '#FEE2E2',
  },
  overdueStatusText: {
    color: '#DC2626',
  },
});
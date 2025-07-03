import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DollarSign, TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-react-native';
import { useState } from 'react';
import DateRangePicker from '@/components/DateRangePicker';
import SalesChart from '@/components/SalesChart';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { orders, expenses, getFilteredData } = useData();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const filteredData = getFilteredData(startDate || undefined, endDate || undefined);
  const totalRevenue = filteredData.orders.reduce((sum, order) => sum + order.amount, 0);
  const totalExpenses = filteredData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const paidOrders = filteredData.orders.filter(order => order.status === 'paid').length;

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}!</Text>
          <Text style={styles.subtitle}>Here's your business overview</Text>
        </View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.dateButtonText}>
            {startDate && endDate ? 'Filtered' : 'Filter'}
          </Text>
        </TouchableOpacity>
      </View>

      {(startDate && endDate) && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            Showing data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={styles.clearFilter}>Clear filter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.revenueCard]}>
          <View style={styles.statIcon}>
            <DollarSign size={24} color="#10B981" />
          </View>
          <Text style={styles.statValue}>${totalRevenue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>

        <View style={[styles.statCard, styles.expenseCard]}>
          <View style={styles.statIcon}>
            <TrendingDown size={24} color="#EF4444" />
          </View>
          <Text style={styles.statValue}>${totalExpenses.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Expenses</Text>
        </View>

        <View style={[styles.statCard, styles.profitCard]}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>${profit.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Profit</Text>
        </View>

        <View style={[styles.statCard, styles.ordersCard]}>
          <View style={styles.statIcon}>
            <FileText size={24} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>{paidOrders}</Text>
          <Text style={styles.statLabel}>Paid Orders</Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Sales Overview</Text>
        <SalesChart orders={filteredData.orders} expenses={filteredData.expenses} />
      </View>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {filteredData.orders.slice(0, 3).map((order) => (
          <View key={order.id} style={styles.recentItem}>
            <View>
              <Text style={styles.recentTitle}>{order.clientName}</Text>
              <Text style={styles.recentSubtitle}>{order.invoiceNumber}</Text>
            </View>
            <View style={styles.recentRight}>
              <Text style={styles.recentAmount}>${order.amount.toLocaleString()}</Text>
              <View style={[styles.statusBadge, styles[`${order.status}Badge`]]}>
                <Text style={[styles.statusText, styles[`${order.status}Text`]]}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  revenueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  profitCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  ordersCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  chartSection: {
    margin: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  recentSection: {
    margin: 24,
    marginTop: 0,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  recentSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  recentRight: {
    alignItems: 'flex-end',
  },
  recentAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  paidBadge: {
    backgroundColor: '#DCFCE7',
  },
  paidText: {
    color: '#16A34A',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  pendingText: {
    color: '#D97706',
  },
  overdueBadge: {
    backgroundColor: '#FEE2E2',
  },
  overdueText: {
    color: '#DC2626',
  },
});
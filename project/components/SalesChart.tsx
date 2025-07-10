import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Order, Expense } from '@/context/DataContext';

interface SalesChartProps {
  orders: Order[];
  expenses: Expense[];
}

const { width } = Dimensions.get('window');
const chartWidth = width - 80;

export default function SalesChart({ orders, expenses }: SalesChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate.toDateString() === date.toDateString();
    });

    const dayExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.toDateString() === date.toDateString();
    });

    const revenue = dayOrders.reduce((sum, order) => sum + order.amount, 0);
    const expense = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      date,
      revenue,
      expense,
      profit: revenue - expense,
    };
  });

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.revenue, d.expense)),
    1000
  );

  const getBarHeight = (value: number) => {
    return Math.max((value / maxValue) * 120, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>${maxValue.toLocaleString()}</Text>
          <Text style={styles.yAxisLabel}>${(maxValue / 2).toLocaleString()}</Text>
          <Text style={styles.yAxisLabel}>$0</Text>
        </View>

        <View style={styles.chartArea}>
          {chartData.map((data, index) => (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.bars}>
                <View
                  style={[
                    styles.bar,
                    styles.revenueBar,
                    { height: getBarHeight(data.revenue) },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.expenseBar,
                    { height: getBarHeight(data.expense) },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>
                {data.date.toLocaleDateString('en', { weekday: 'short' })}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.revenueColor]} />
          <Text style={styles.legendText}>Revenue</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.expenseColor]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 140,
    marginBottom: 16,
  },
  yAxis: {
    width: 60,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chartArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 2,
  },
  bar: {
    width: 12,
    borderRadius: 2,
    minHeight: 2,
  },
  revenueBar: {
    backgroundColor: '#10B981',
  },
  expenseBar: {
    backgroundColor: '#EF4444',
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  revenueColor: {
    backgroundColor: '#10B981',
  },
  expenseColor: {
    backgroundColor: '#EF4444',
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});
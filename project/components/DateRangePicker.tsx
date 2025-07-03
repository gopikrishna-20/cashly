import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useState } from 'react';
import { X } from 'lucide-react-native';

interface DateRangePickerProps {
  onSelect: (startDate: Date, endDate: Date) => void;
  onClose: () => void;
}

export default function DateRangePicker({ onSelect, onClose }: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'quarter' | 'year' | null>(null);

  const getDateRange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return { start, end: now };
  };

  const handleRangeSelect = (range: 'week' | 'month' | 'quarter' | 'year') => {
    const { start, end } = getDateRange(range);
    setSelectedRange(range);
    onSelect(start, end);
  };

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Date Range</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.options}>
            {[
              { key: 'week', label: 'Last 7 days' },
              { key: 'month', label: 'Last 30 days' },
              { key: 'quarter', label: 'Last 3 months' },
              { key: 'year', label: 'Last year' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.option,
                  selectedRange === option.key && styles.selectedOption,
                ]}
                onPress={() => handleRangeSelect(option.key as any)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRange === option.key && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  options: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#3B82F6',
  },
});
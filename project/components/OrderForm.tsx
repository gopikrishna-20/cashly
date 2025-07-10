import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useData, Order } from '@/context/DataContext';
import { X, Save } from 'lucide-react-native';

interface OrderFormProps {
  order?: Order | null;
  onClose: () => void;
}

export default function OrderForm({ order, onClose }: OrderFormProps) {
  const { addOrder, updateOrder } = useData();
  const [formData, setFormData] = useState({
    clientName: '',
    amount: '',
    status: 'pending' as Order['status'],
    description: '',
    invoiceNumber: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        clientName: order.clientName,
        amount: order.amount.toString(),
        status: order.status,
        description: order.description,
        invoiceNumber: order.invoiceNumber,
      });
    } else {
      // Generate invoice number for new orders
      const invoiceNum = `INV-${String(Date.now()).slice(-6)}`;
      setFormData(prev => ({ ...prev, invoiceNumber: invoiceNum }));
    }
  }, [order]);

  const handleSave = () => {
    if (!formData.clientName || !formData.amount || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const orderData = {
      clientName: formData.clientName,
      amount,
      status: formData.status,
      date: order?.date || new Date(),
      description: formData.description,
      invoiceNumber: formData.invoiceNumber,
    };

    if (order) {
      updateOrder(order.id, orderData);
    } else {
      addOrder(orderData);
    }

    onClose();
  };

  return (
    <Modal transparent visible animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {order ? 'Edit Order' : 'Create Order'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Client Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.clientName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, clientName: text }))}
                placeholder="Enter client name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Invoice Number</Text>
              <TextInput
                style={styles.input}
                value={formData.invoiceNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, invoiceNumber: text }))}
                placeholder="INV-001"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Amount *</Text>
              <TextInput
                style={styles.input}
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusButtons}>
                {['pending', 'paid', 'overdue'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      formData.status === status && styles.selectedStatus,
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, status: status as Order['status'] }))}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        formData.status === status && styles.selectedStatusText,
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Enter order description"
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {order ? 'Update Order' : 'Create Order'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  form: {
    padding: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  selectedStatus: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedStatusText: {
    color: '#3B82F6',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
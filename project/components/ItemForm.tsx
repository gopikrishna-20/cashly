import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useData, Item } from '@/context/DataContext';
import { X, Save, Package, Hash, DollarSign, Percent } from 'lucide-react-native';

interface ItemFormProps {
  item?: Item | null;
  onClose: () => void;
}

export default function ItemForm({ item, onClose }: ItemFormProps) {
  const { addItem, updateItem } = useData();
  const [formData, setFormData] = useState({
    name: '',
    itemCode: '',
    units: '',
    salePrice: '',
    discount: '',
    purchasePrice: '',
    gstTax: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        itemCode: item.itemCode,
        units: item.units.toString(),
        salePrice: item.salePrice.toString(),
        discount: item.discount.toString(),
        purchasePrice: item.purchasePrice.toString(),
        gstTax: item.gstTax.toString(),
      });
    } else {
      // Generate item code for new items
      const itemCode = `ITM-${String(Date.now()).slice(-6)}`;
      setFormData(prev => ({ ...prev, itemCode }));
    }
  }, [item]);

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return false;
    }

    if (!formData.itemCode.trim()) {
      Alert.alert('Error', 'Please enter item code');
      return false;
    }

    const numericFields = [
      { field: 'units', label: 'Units' },
      { field: 'salePrice', label: 'Sale Price' },
      { field: 'discount', label: 'Discount' },
      { field: 'purchasePrice', label: 'Purchase Price' },
      { field: 'gstTax', label: 'GST Tax' },
    ];

    for (const { field, label } of numericFields) {
      const value = parseFloat(formData[field as keyof typeof formData]);
      if (isNaN(value) || value < 0) {
        Alert.alert('Error', `Please enter a valid ${label}`);
        return false;
      }
    }

    const discount = parseFloat(formData.discount);
    if (discount > 100) {
      Alert.alert('Error', 'Discount cannot be more than 100%');
      return false;
    }

    const gstTax = parseFloat(formData.gstTax);
    if (gstTax > 100) {
      Alert.alert('Error', 'GST Tax cannot be more than 100%');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const itemData = {
      name: formData.name.trim(),
      itemCode: formData.itemCode.trim(),
      units: parseInt(formData.units),
      salePrice: parseFloat(formData.salePrice),
      discount: parseFloat(formData.discount),
      purchasePrice: parseFloat(formData.purchasePrice),
      gstTax: parseFloat(formData.gstTax),
    };

    if (item) {
      updateItem(item.id, itemData);
    } else {
      addItem(itemData);
    }

    onClose();
  };

  const calculatePreview = () => {
    const salePrice = parseFloat(formData.salePrice) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const gstTax = parseFloat(formData.gstTax) || 0;

    const discountedPrice = salePrice - (salePrice * discount / 100);
    const gstAmount = (discountedPrice * gstTax) / 100;
    const finalPrice = discountedPrice + gstAmount;
    const profit = discountedPrice - purchasePrice;

    return {
      discountedPrice,
      gstAmount,
      finalPrice,
      profit,
    };
  };

  const preview = calculatePreview();

  return (
    <Modal transparent visible animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Package size={24} color="#3B82F6" />
              <Text style={styles.title}>
                {item ? 'Edit Item' : 'Add New Item'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.field}>
                <Text style={styles.label}>Item Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter item name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Item Code *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.itemCode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, itemCode: text }))}
                  placeholder="ITM-001"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Number of Units *</Text>
                <View style={styles.inputContainer}>
                  <Hash size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.inputWithIcon}
                    value={formData.units}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, units: text }))}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              
              <View style={styles.row}>
                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.label}>Sale Price *</Text>
                  <View style={styles.inputContainer}>
                    <DollarSign size={20} color="#10B981" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      value={formData.salePrice}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, salePrice: text }))}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.label}>Discount *</Text>
                  <View style={styles.inputContainer}>
                    <Percent size={20} color="#F59E0B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      value={formData.discount}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, discount: text }))}
                      placeholder="0"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.label}>Purchase Price *</Text>
                  <View style={styles.inputContainer}>
                    <DollarSign size={20} color="#EF4444" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      value={formData.purchasePrice}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, purchasePrice: text }))}
                      placeholder="0.00"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>

                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.label}>GST Tax *</Text>
                  <View style={styles.inputContainer}>
                    <Percent size={20} color="#3B82F6" style={styles.inputIcon} />
                    <TextInput
                      style={styles.inputWithIcon}
                      value={formData.gstTax}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, gstTax: text }))}
                      placeholder="18"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Sale Price:</Text>
                  <Text style={styles.previewValue}>${parseFloat(formData.salePrice || '0').toFixed(2)}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>After Discount:</Text>
                  <Text style={styles.previewValue}>${preview.discountedPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>GST Amount:</Text>
                  <Text style={styles.previewValue}>${preview.gstAmount.toFixed(2)}</Text>
                </View>
                <View style={[styles.previewRow, styles.finalPriceRow]}>
                  <Text style={styles.finalPriceLabel}>Final Price:</Text>
                  <Text style={styles.finalPriceValue}>${preview.finalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Profit per unit:</Text>
                  <Text style={[styles.previewValue, { color: preview.profit >= 0 ? '#10B981' : '#EF4444' }]}>
                    ${preview.profit.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {item ? 'Update Item' : 'Add Item'}
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
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  form: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -4,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWithIcon: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  previewCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalPriceRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  previewValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  finalPriceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  finalPriceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
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
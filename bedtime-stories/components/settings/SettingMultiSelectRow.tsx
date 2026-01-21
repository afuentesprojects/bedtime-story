import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChildFriendlyFont } from '@/constants/theme';

interface SettingMultiSelectRowProps {
  title: string;
  selectedItems: string[];
  availableItems: string[];
  onSelectionChange: (items: string[]) => void;
  maxSelections?: number;
}

export function SettingMultiSelectRow({ 
  title, 
  selectedItems, 
  availableItems, 
  onSelectionChange,
  maxSelections 
}: SettingMultiSelectRowProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempSelectedItems, setTempSelectedItems] = useState<string[]>(selectedItems);

  const handleItemToggle = (item: string) => {
    const isCurrentlySelected = tempSelectedItems.includes(item);
    
    if (isCurrentlySelected) {
      // Remove item
      setTempSelectedItems(prev => prev.filter(i => i !== item));
    } else {
      // Add item (check max limit)
      if (!maxSelections || tempSelectedItems.length < maxSelections) {
        setTempSelectedItems(prev => [...prev, item]);
      }
    }
  };

  const handleDone = () => {
    onSelectionChange(tempSelectedItems);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setTempSelectedItems(selectedItems);
    setIsModalVisible(false);
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) return 'None selected';
    if (selectedItems.length === 1) return selectedItems[0];
    if (selectedItems.length <= 3) return selectedItems.join(', ');
    return `${selectedItems.length} selected`;
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setIsModalVisible(true)}>
        <View style={styles.labelContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.value}>{getDisplayText()}</ThemedText>
          {selectedItems.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tagsContainer}
            >
              {selectedItems.map((item, index) => (
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{item}</ThemedText>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        <ThemedText style={styles.arrow}>›</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>
              Select {title}
              {maxSelections && ` (${tempSelectedItems.length}/${maxSelections})`}
            </ThemedText>
            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={handleDone}
            >
              <ThemedText style={styles.doneButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={availableItems}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = tempSelectedItems.includes(item);
              const canSelect = !maxSelections || tempSelectedItems.length < maxSelections || isSelected;
              
              return (
                <TouchableOpacity
                  style={[
                    styles.optionRow,
                    !canSelect && styles.disabledOptionRow
                  ]}
                  onPress={() => handleItemToggle(item)}
                  disabled={!canSelect}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkedCheckbox
                    ]}>
                      {isSelected && (
                        <ThemedText style={styles.checkboxCheck}>✓</ThemedText>
                      )}
                    </View>
                  </View>
                  <ThemedText style={[
                    styles.optionText,
                    !canSelect && styles.disabledOptionText
                  ]}>
                    {item}
                  </ThemedText>
                </TouchableOpacity>
              );
            }}
          />
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
  },
  labelContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: ChildFriendlyFont,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.7,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: ChildFriendlyFont,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: ChildFriendlyFont,
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: ChildFriendlyFont,
    opacity: 0.8,
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: ChildFriendlyFont,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  disabledOptionRow: {
    opacity: 0.5,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxCheck: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  optionText: {
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
    flex: 1,
  },
  disabledOptionText: {
    opacity: 0.6,
  },
});
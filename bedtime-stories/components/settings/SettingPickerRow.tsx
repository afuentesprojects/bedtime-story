import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChildFriendlyFont } from '@/constants/theme';

interface SettingPickerRowProps {
  title: string;
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
}

export function SettingPickerRow({ title, value, options, onValueChange }: SettingPickerRowProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOptionSelect = (option: string) => {
    onValueChange(option);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setIsModalVisible(true)}>
        <View style={styles.labelContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.value}>{value}</ThemedText>
        </View>
        <ThemedText style={styles.arrow}>›</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Select {title}</ThemedText>
            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <ThemedText style={styles.doneButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.optionRow,
                  item === value && styles.selectedOptionRow
                ]}
                onPress={() => handleOptionSelect(item)}
              >
                <ThemedText style={[
                  styles.optionText,
                  item === value && styles.selectedOptionText
                ]}>
                  {item}
                </ThemedText>
                {item === value && (
                  <ThemedText style={styles.checkmark}>✓</ThemedText>
                )}
              </TouchableOpacity>
            )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedOptionRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionText: {
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
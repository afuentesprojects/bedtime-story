import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChildFriendlyFont } from '@/constants/theme';

interface SettingTextInputRowProps {
  title: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export function SettingTextInputRow({ 
  title, 
  placeholder,
  value,
  onValueChange,
  maxLength = 50,
  multiline = false,
  autoCapitalize = 'words',
  keyboardType = 'default'
}: SettingTextInputRowProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    const trimmedValue = tempValue.trim();
    onValueChange(trimmedValue);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsModalVisible(false);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Value',
      `Are you sure you want to clear the ${title.toLowerCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setTempValue('');
          }
        }
      ]
    );
  };

  const getDisplayValue = () => {
    if (!value || value.trim() === '') return 'Not set';
    if (value.length > 30) return `${value.substring(0, 30)}...`;
    return value;
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setIsModalVisible(true)}>
        <View style={styles.labelContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={[
            styles.value,
            !value && styles.emptyValue
          ]}>
            {getDisplayValue()}
          </ThemedText>
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
            <ThemedText style={styles.modalTitle}>Edit {title}</ThemedText>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSave}
            >
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>{title}</ThemedText>
            <TextInput
              style={[
                styles.textInput,
                multiline && styles.multilineTextInput
              ]}
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={placeholder}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              maxLength={maxLength}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              selectionColor="rgba(255, 255, 255, 0.8)"
              autoFocus
            />
            
            <View style={styles.inputFooter}>
              <ThemedText style={styles.charCount}>
                {tempValue.length}/{maxLength}
              </ThemedText>
              {tempValue.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                  <ThemedText style={styles.clearButton}>Clear</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {multiline && (
            <View style={styles.helpContainer}>
              <ThemedText style={styles.helpText}>
                Tip: Be specific about what you&apos;d like to include in your stories.
              </ThemedText>
            </View>
          )}
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
  emptyValue: {
    opacity: 0.5,
    fontStyle: 'italic',
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: ChildFriendlyFont,
  },
  inputContainer: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: ChildFriendlyFont,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  multilineTextInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.6,
  },
  clearButton: {
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  helpContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  helpText: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.7,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChildFriendlyFont } from '@/constants/theme';
import { SettingPickerRow, SettingMultiSelectRow, SettingTextInputRow } from '@/components/settings';
import { useSettings } from '@/hooks/useSettings';

const LANGUAGES = ['English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian'];
const LENGTH_OPTIONS = ['1 minute', '3 minutes', '5 minutes', '8 minutes', '10 minutes', '12 minutes'];
const DEFAULT_THEMES = ['Friendship', 'Family', 'Siblings', 'Adventure', 'Romance', 'Magic', 'Mystery', 'Courage', 'Kindness', 'Learning'];
const DEFAULT_TOPICS = ['Dinosaurs', 'Robots', 'Space', 'Princesses', 'Wizards', 'Animals', 'Pirates', 'Fairies', 'Dragons', 'Superheroes'];

export default function SettingsScreen() {
  const { settings, isLoading, error, updateSetting } = useSettings();

  // Combine default and custom themes/topics
  const allThemes = [...DEFAULT_THEMES, ...(settings.customTheme.trim() ? [settings.customTheme.trim()] : [])];
  const allTopics = [...DEFAULT_TOPICS, ...(settings.customTopic.trim() ? [settings.customTopic.trim()] : [])];

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <ThemedText style={styles.loadingText}>Loading settings...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>Customize your story experience</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.settingSection}>
            <ThemedText style={styles.sectionTitle}>Basic Settings</ThemedText>
            
            <SettingPickerRow
              title="Language"
              value={settings.language}
              options={LANGUAGES}
              onValueChange={(value) => updateSetting('language', value)}
            />
            
            <SettingPickerRow
              title="Default Story Length"
              value={settings.defaultLength}
              options={LENGTH_OPTIONS}
              onValueChange={(value) => updateSetting('defaultLength', value)}
            />
            
            <SettingTextInputRow
              title="Child's Name"
              placeholder="Enter your child's name (optional)"
              value={settings.childName}
              onValueChange={(value) => updateSetting('childName', value)}
              maxLength={30}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.settingSection}>
            <ThemedText style={styles.sectionTitle}>Story Themes</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Choose themes you&apos;d like your stories to explore
            </ThemedText>
            
            <SettingMultiSelectRow
              title="Preferred Themes"
              selectedItems={settings.selectedThemes}
              availableItems={allThemes}
              onSelectionChange={(value) => updateSetting('selectedThemes', value)}
            />
            
            <SettingTextInputRow
              title="Add Custom Theme"
              placeholder="e.g., Environmental, Creativity, Teamwork"
              value={settings.customTheme}
              onValueChange={(value) => updateSetting('customTheme', value)}
              maxLength={50}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.settingSection}>
            <ThemedText style={styles.sectionTitle}>Story Topics</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Select topics your child loves
            </ThemedText>
            
            <SettingMultiSelectRow
              title="Favorite Topics"
              selectedItems={settings.selectedTopics}
              availableItems={allTopics}
              onSelectionChange={(value) => updateSetting('selectedTopics', value)}
            />
            
            <SettingTextInputRow
              title="Add Custom Topic"
              placeholder="e.g., Trucks, Ballet, Cooking, Music"
              value={settings.customTopic}
              onValueChange={(value) => updateSetting('customTopic', value)}
              maxLength={50}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.accountSection}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <View style={styles.accountInfo}>
              <ThemedText style={styles.accountText}>• Sign in to save stories across devices</ThemedText>
              <ThemedText style={styles.accountText}>• Sync settings and preferences</ThemedText>
              <ThemedText style={styles.accountText}>• Access story history anywhere</ThemedText>
            </View>
          </View>
          
          <View style={styles.versionContainer}>
            <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    gap: 8,
  },
  title: {
    fontFamily: ChildFriendlyFont,
  },
  subtitle: {
    fontFamily: ChildFriendlyFont,
    opacity: 0.8,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
    gap: 30,
  },
  settingSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: ChildFriendlyFont,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.7,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  accountSection: {
    gap: 12,
    marginTop: 10,
  },
  accountInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  accountText: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  version: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
    color: '#FF6B6B',
    textAlign: 'center',
  },
});
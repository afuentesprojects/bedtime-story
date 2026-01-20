import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChildFriendlyFont } from '@/constants/theme';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>Customize your story experience</ThemedText>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.settingSection}>
          <ThemedText style={styles.sectionTitle}>Story Preferences</ThemedText>
          <ThemedText style={styles.settingItem}>• Language: English</ThemedText>
          <ThemedText style={styles.settingItem}>• Default Length: 5 minutes</ThemedText>
          <ThemedText style={styles.settingItem}>• Child&apos;s Name: Not set</ThemedText>
        </View>
        
        <View style={styles.settingSection}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          <ThemedText style={styles.settingItem}>• Sign in to save stories</ThemedText>
          <ThemedText style={styles.settingItem}>• Sync across devices</ThemedText>
        </View>
        
        <View style={styles.versionContainer}>
          <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    gap: 8,
  },
  title: {
    fontFamily: ChildFriendlyFont,
  },
  subtitle: {
    fontFamily: ChildFriendlyFont,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
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
  settingItem: {
    fontSize: 16,
    fontFamily: ChildFriendlyFont,
    opacity: 0.8,
    marginLeft: 8,
  },
  versionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  version: {
    fontSize: 14,
    fontFamily: ChildFriendlyFont,
    opacity: 0.5,
  },
});
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChildFriendlyFont } from '@/constants/theme';

export default function MyStoriesScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText type="title" style={styles.title}>My Stories</ThemedText>
        <ThemedText style={styles.subtitle}>Your saved bedtime stories</ThemedText>
      </View>
      
      <View style={styles.contentContainer}>
        <ThemedText style={styles.emptyMessage}>
          You haven&apos;t saved any stories yet.
        </ThemedText>
        <ThemedText style={styles.emptySubMessage}>
          Create your first story from the Home tab!
        </ThemedText>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: ChildFriendlyFont,
    opacity: 0.7,
  },
  emptySubMessage: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: ChildFriendlyFont,
    opacity: 0.6,
  },
});
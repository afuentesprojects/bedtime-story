import { StyleSheet, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StoryTypeCard } from '@/components/StoryTypeCard';

export default function HomeScreen() {
  const handleOriginalStory = () => {
    Alert.alert('Original Story', 'Navigate to original story creation');
  };

  const handleClassicStory = () => {
    Alert.alert('Classic Story', 'Navigate to classic story selection');
  };

  const handleRemixStory = () => {
    Alert.alert('Remix Story', 'Navigate to story remix creation');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Bedtime Stories</ThemedText>
        <ThemedText>Choose how to create your story</ThemedText>
      </View>
      
      <View style={styles.cardsContainer}>
        <StoryTypeCard
          title="Original Story"
          iconSource={require('@/assets/images/original-story.webp')}
          onPress={handleOriginalStory}
        />
        
        <StoryTypeCard
          title="Classic Tale"
          iconSource={require('@/assets/images/classic-story-1.webp')}
          onPress={handleClassicStory}
        />
        
        <StoryTypeCard
          title="Remix a Classic"
          iconSource={require('@/assets/images/remix-a-classic.webp')}
          onPress={handleRemixStory}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    gap: 8,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
});

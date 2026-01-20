import { StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ChildFriendlyFont } from '@/constants/theme';

export type StoryTypeCardProps = {
  title: string;
  iconSource: any;
  onPress: () => void;
};

export function StoryTypeCard({ title, iconSource, onPress }: StoryTypeCardProps) {
  const borderColor = useThemeColor({}, 'icon');

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageSection}>
        <Image 
          source={iconSource} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textSection}>
        <ThemedText style={styles.title}>
          {title}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 12,
    height: 185,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  imageSection: {
    height: 140,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textSection: {
    height: 45,
    backgroundColor: '#5b2c87',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: ChildFriendlyFont,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
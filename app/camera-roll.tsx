import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface SavedPhoto {
  id: string;
  uri: string;
  timestamp: number;
}

export default function CameraRollScreen() {
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const photosJson = await AsyncStorage.getItem('camden_photos');
      if (photosJson) {
        const loadedPhotos: SavedPhoto[] = JSON.parse(photosJson);
        setPhotos(loadedPhotos.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleSharePhoto = async (uri: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      const updatedPhotos = photos.filter(p => p.id !== id);
      await AsyncStorage.setItem('camden_photos',
JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const renderPhoto = ({ item }: { item: SavedPhoto }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
      <View style={styles.photoActions}>
        <Pressable
          style={styles.shareButton}
          onPress={() => handleSharePhoto(item.uri)}
        >
          <Text style={styles.actionButtonText}>Share</Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeletePhoto(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.star, styles.star1]}>⭐</Text>
      <Text style={[styles.star, styles.star2]}>⭐</Text>
      <Text style={[styles.star, styles.star3]}>⭐</Text>
      <Text style={[styles.star, styles.star4]}>⭐</Text>

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() =>
router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <ThemedText type="title" style={styles.title}>Camera
Roll</ThemedText>
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            No photos yet. Take some photos to see them here!
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
        />
      )}
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');
const photoSize = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B3A57',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#F5F1E8',
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    color: '#F5F1E8',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#F5F1E8',
    opacity: 0.7,
  },
  photoCard: {
    width: photoSize,
    margin: 10,
    backgroundColor: '#5A7A99',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: photoSize,
    backgroundColor: '#7A9AB9',
  },
  photoActions: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#7A9AB9',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#A8563F',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#F5F1E8',
    fontSize: 12,
    fontWeight: '600',
  },
  star: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.6,
    zIndex: 0,
  },
  star1: {
    top: 80,
    left: 25,
    fontSize: 14,
  },
  star2: {
    top: 200,
    right: 30,
    fontSize: 18,
  },
  star3: {
    top: 400,
    left: 20,
    fontSize: 12,
  },
  star4: {
    top: 550,
    right: 25,
    fontSize: 16,
  },
});
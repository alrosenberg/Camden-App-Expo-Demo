import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

type ShotType = 'portrait' | 'cowboy' | 'fullbody' | 'group';

interface PresetData {
  id: string;
  name: string;
  shotType: ShotType;
  horizontalCount: string;
  verticalCount: string;
  frequency: string;
}

export default function PresetListScreen() {
  const [presets, setPresets] = useState<PresetData[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadPresets();
    }, [])
  );

  const loadPresets = async () => {
    try {
      const presetsJson = await AsyncStorage.getItem('camden_presets');
      if (presetsJson) {
        const loadedPresets: PresetData[] = JSON.parse(presetsJson);
        setPresets(loadedPresets);
      }
    } catch (error) {
      console.error('Error loading presets:', error);
    }
  };

  const handleNewPreset = () => {
    router.push('/settings');
  };

  const handleSelectPreset = (preset: PresetData) => {
    router.push({
      pathname: '/photographer',
      params: {
        horizontalCount: preset.horizontalCount,
        verticalCount: preset.verticalCount,
        frequency: preset.frequency,
        shotType: preset.shotType,
      },
    });
  };

  const handleEditPreset = (preset: PresetData) => {
    router.push({
      pathname: '/settings',
      params: {
        presetId: preset.id,
      },
    });
  };

  const handleDeletePreset = async (presetId: string) => {
    Alert.alert(
      'Delete Preset',
      'Are you sure you want to delete this preset?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPresets = presets.filter(p => p.id !==
presetId);
              await AsyncStorage.setItem('camden_presets',
JSON.stringify(updatedPresets));
              setPresets(updatedPresets);
            } catch (error) {
              console.error('Error deleting preset:', error);
              alert('Failed to delete preset');
            }
          },
        },
      ]
    );
  };

  const handleCameraRoll = () => {
    router.push('/camera-roll');
  };

  const renderPresetItem = ({ item }: { item: PresetData }) => (
    <View style={styles.presetCard}>
      <Pressable
        style={styles.presetMainButton}
        onPress={() => handleSelectPreset(item)}
      >
        <View>
          <Text style={styles.presetName}>{item.name}</Text>
          <Text style={styles.presetDetails}>
            {item.shotType.charAt(0).toUpperCase() +
item.shotType.slice(1)} •
            {item.horizontalCount}H / {item.verticalCount}V •
            {item.frequency}s
          </Text>
        </View>
      </Pressable>
      <View style={styles.presetActions}>
        <Pressable
          style={styles.editButton}
          onPress={() => handleEditPreset(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeletePreset(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
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
      <Text style={[styles.star, styles.star5]}>⭐</Text>
      <Text style={[styles.star, styles.star6]}>⭐</Text>
      <Text style={[styles.star, styles.star7]}>⭐</Text>
      <Text style={[styles.star, styles.star8]}>⭐</Text>

      <Pressable style={styles.cameraRollButton} 
onPress={handleCameraRoll}>
        <Text style={styles.cameraRollButtonText}>📷</Text>
      </Pressable>

      <ThemedText type="title" style={styles.title}>Camden</ThemedText>
      <ThemedText style={styles.subtitle}>Photographer
Presets</ThemedText>

      <Pressable style={styles.newPresetButton} onPress={handleNewPreset}>
        <Text style={styles.newPresetButtonText}>+ New Preset</Text>
      </Pressable>

      {presets.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateText}>
            No presets yet. Create your first preset to get started!
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={presets}
          renderItem={renderPresetItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1B3A57',
  },
  title: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 120,
    color: '#F5F1E8',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#F5F1E8',
    opacity: 0.8,
  },
  newPresetButton: {
    backgroundColor: '#5A7A99',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  newPresetButtonText: {
    color: '#F5F1E8',
    fontSize: 18,
    fontWeight: 'bold',
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
  presetCard: {
    backgroundColor: '#5A7A99',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#7A9AB9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  presetMainButton: {
    marginBottom: 12,
  },
  presetName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F1E8',
    marginBottom: 4,
  },
  presetDetails: {
    fontSize: 14,
    color: '#F5F1E8',
    opacity: 0.8,
  },
  presetActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#7A9AB9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#F5F1E8',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#A8563F',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#F5F1E8',
    fontSize: 14,
    fontWeight: '600',
  },
  star: {
    position: 'absolute',
    fontSize: 16,
    opacity: 0.6,
    zIndex: 0,
  },
  star1: {
    top: 60,
    left: 15,
    fontSize: 14,
  },
  star2: {
    top: 140,
    right: 20,
    fontSize: 18,
  },
  star3: {
    top: 320,
    left: 25,
    fontSize: 12,
  },
  star4: {
    top: 480,
    right: 30,
    fontSize: 16,
  },
  star5: {
    top: 200,
    left: 10,
    fontSize: 15,
  },
  star6: {
    top: 400,
    right: 15,
    fontSize: 13,
  },
  star7: {
    top: 90,
    right: 45,
    fontSize: 11,
  },
  star8: {
    top: 550,
    left: 35,
    fontSize: 17,
  },
  cameraRollButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5A7A99',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  cameraRollButtonText: {
    fontSize: 28,
  },
});
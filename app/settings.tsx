import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

  type ShotType = 'portrait' | 'cowboy' | 'fullbody' | 'group';

  export interface PresetData {
    id: string;
    name: string;
    shotType: ShotType;
    horizontalCount: string;
    verticalCount: string;
    frequency: string;
  }

  export default function SettingsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const presetId = params.presetId as string | undefined;

    const [presetName, setPresetName] = useState('');
    const [horizontalCount, setHorizontalCount] = useState('');
    const [verticalCount, setVerticalCount] = useState('');
    const [frequency, setFrequency] = useState('');
    const [shotType] = useState<ShotType>('portrait');

    useEffect(() => {
      if (presetId) {
        loadPreset(presetId);
      }
    }, [presetId]);

    const loadPreset = async (id: string) => {
      try {
        const presetsJson = await AsyncStorage.getItem('camden_presets');
        if (presetsJson) {
          const presets: PresetData[] = JSON.parse(presetsJson);
          const preset = presets.find(p => p.id === id);
          if (preset) {
            setPresetName(preset.name);
            setHorizontalCount(preset.horizontalCount);
            setVerticalCount(preset.verticalCount);
            setFrequency(preset.frequency);
          }
        }
      } catch (error) {
        console.error('Error loading preset:', error);
      }
    };

    const handleSaveAndGo = async () => {
      if (!presetName || !horizontalCount || !verticalCount || !frequency) {
        alert('Please fill in all fields');
        return;
      }

      try {
        const presetsJson = await AsyncStorage.getItem('camden_presets');
        let presets: PresetData[] = presetsJson ? JSON.parse(presetsJson) :
  [];

        const preset: PresetData = {
          id: presetId || Date.now().toString(),
          name: presetName,
          shotType,
          horizontalCount,
          verticalCount,
          frequency,
        };

        if (presetId) {
          presets = presets.map(p => p.id === presetId ? preset : p);
        } else {
          presets.push(preset);
        }

        await AsyncStorage.setItem('camden_presets',
  JSON.stringify(presets));

        router.push({
          pathname: '/photographer',
          params: {
            horizontalCount,
            verticalCount,
            frequency,
            shotType,
          },
        });
      } catch (error) {
        console.error('Error saving preset:', error);
        alert('Failed to save preset');
      }
    };

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

        <ScrollView style={styles.scrollView} 
  contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>Preset
  Settings</ThemedText>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Preset Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., Birthday Party, Headshots"
              value={presetName}
              onChangeText={setPresetName}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Horizontal Photos</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Number of horizontal photos"
              keyboardType="numeric"
              value={horizontalCount}
              onChangeText={setHorizontalCount}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Vertical Photos</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Number of vertical photos"
              keyboardType="numeric"
              value={verticalCount}
              onChangeText={setVerticalCount}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Photo Frequency
  (seconds)</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Seconds between photos"
              keyboardType="numeric"
              value={frequency}
              onChangeText={setFrequency}
              placeholderTextColor="#999"
            />
          </View>

          <Pressable
            style={styles.saveButton}
            onPress={handleSaveAndGo}
          >
            <Text style={styles.buttonText}>Save and Go</Text>
          </Pressable>
        </ScrollView>
      </ThemedView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F1E8',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    title: {
      fontSize: 32,
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 20,
      color: '#1B3A57',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      fontWeight: '500',
      color: '#1B3A57',
    },
    input: {
      borderWidth: 2,
      borderColor: '#E8DCC4',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#fff',
      color: '#1B3A57',
    },
    saveButton: {
      backgroundColor: '#5A7A99',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
      shadowColor: '#1B3A57',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: '#F5F1E8',
      fontSize: 18,
      fontWeight: 'bold',
    },
    star: {
      position: 'absolute',
      fontSize: 16,
      opacity: 0.6,
      zIndex: 0,
    },
    star1: {
      top: 70,
      left: 20,
      fontSize: 15,
    },
    star2: {
      top: 180,
      right: 25,
      fontSize: 13,
    },
    star3: {
      top: 350,
      left: 18,
      fontSize: 17,
    },
    star4: {
      top: 520,
      right: 22,
      fontSize: 12,
    },
    star5: {
      top: 240,
      left: 12,
      fontSize: 14,
    },
    star6: {
      top: 450,
      right: 18,
      fontSize: 16,
    },
    star7: {
      top: 120,
      right: 40,
      fontSize: 11,
    },
    star8: {
      top: 600,
      left: 30,
      fontSize: 18,
    },
  });
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

type Orientation = 'horizontal' | 'vertical';
type CaptureState = 'waiting' | 'countdown' | 'capturing' | 'complete';
type ShotType = 'portrait' | 'cowboy' | 'fullbody' | 'group';

export default function PhotographerScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const horizontalCount = parseInt(params.horizontalCount as string) || 0;
  const verticalCount = parseInt(params.verticalCount as string) || 0;
  const frequency = parseInt(params.frequency as string) || 3;
  const shotType = (params.shotType as ShotType) || 'portrait';

  const [cameraPermission, requestCameraPermission] =
useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  const [orientation, setOrientation] =
useState<Orientation>('horizontal');
  const [captureState, setCaptureState] =
useState<CaptureState>('waiting');
  const [horizontalTaken, setHorizontalTaken] = useState(0);
  const [verticalTaken, setVerticalTaken] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showPrompt, setShowPrompt] = useState('');
  const [shutterPressed, setShutterPressed] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!cameraPermission) {
      requestCameraPermission();
    }
    if (!mediaPermission) {
      requestMediaPermission();
    }

    return () => {
      if (countdownTimerRef.current)
clearInterval(countdownTimerRef.current);
    };
  }, []);

  const handleShutterPress = () => {
    setShutterPressed(true);
    startCountdown();
  };

  const startCountdown = () => {
    setCaptureState('countdown');
    setCountdown(3);

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
        }
        startCapturing();
      }
    }, 1000);
  };

  const startCapturing = async () => {
    setCaptureState('capturing');

    const totalToCapture = orientation === 'horizontal' ? horizontalCount
: verticalCount;

    for (let i = 0; i < totalToCapture; i++) {
      await takePhoto();

      if (orientation === 'horizontal') {
        setHorizontalTaken(i + 1);
      } else {
        setVerticalTaken(i + 1);
      }

      if (i < totalToCapture - 1) {
        await new Promise(resolve => setTimeout(resolve, frequency *
1000));
      }
    }

    completeCurrentOrientation();
  };

  const completeCurrentOrientation = () => {
    if (orientation === 'horizontal' && verticalCount > 0) {
      setOrientation('vertical');
      setShowPrompt('Rotate phone to portrait (vertical) and press shutter when ready');
      setCaptureState('waiting');
      setShutterPressed(false);
    } else {
      setCaptureState('complete');
      setShowPrompt('All photos taken! Return to user mode');
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      if (photo) {
        if (mediaPermission?.granted) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }

        await savePhotoToApp(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const savePhotoToApp = async (uri: string) => {
    try {
      const photosJson = await AsyncStorage.getItem('camden_photos');
      let photos = photosJson ? JSON.parse(photosJson) : [];

      const newPhoto = {
        id: Date.now().toString(),
        uri: uri,
        timestamp: Date.now(),
      };

      photos.push(newPhoto);
      await AsyncStorage.setItem('camden_photos', JSON.stringify(photos));
    } catch (error) {
      console.error('Error saving photo to app:', error);
    }
  };


  const handleReturnToUser = () => {
    if (countdownTimerRef.current)
clearInterval(countdownTimerRef.current);
    router.back();
  };

  if (!cameraPermission?.granted || !mediaPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera and media library permissions
are required</Text>
        <Pressable style={styles.button} onPress={() => {
          requestCameraPermission();
          requestMediaPermission();
        }}>
          <Text style={styles.buttonText}>Grant Permissions</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {countdown > 0 && captureState === 'countdown' && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{countdown}</Text>
          </View>
        )}

        {showPrompt && (
          <View style={styles.promptBanner}>
            <Text style={styles.bannerText}>{showPrompt}</Text>
          </View>
        )}

        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {shotType.charAt(0).toUpperCase() + shotType.slice(1)} Shot
          </Text>
          <Text style={styles.statusText}>
            {orientation === 'horizontal' ? 'Horizontal' : 'Vertical'}: {
              orientation === 'horizontal' ? horizontalTaken :
verticalTaken
            }/{orientation === 'horizontal' ? horizontalCount :
verticalCount}
          </Text>
        </View>

        <View style={styles.controls}>
          {captureState === 'waiting' && (
            <Pressable
              style={[styles.shutterButton, shutterPressed && 
styles.shutterButtonDisabled]}
              onPress={handleShutterPress}
              disabled={shutterPressed}
            >
              <View style={[styles.shutterInner, shutterPressed && 
styles.shutterInnerDisabled]} />
            </Pressable>
          )}

          {captureState === 'complete' && (
            <Pressable style={styles.returnButton} 
onPress={handleReturnToUser}>
              <Text style={styles.buttonText}>Return to User</Text>
            </Pressable>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  message: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(27, 58, 87, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: '#F5F1E8',
    fontSize: 120,
    fontWeight: 'bold',
  },
  promptBanner: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(90, 122, 153, 0.9)',
    padding: 15,
  },
  statusBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(27, 58, 87, 0.8)',
    padding: 15,
  },
  statusText: {
    color: '#F5F1E8',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F1E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#1B3A57',
  },
  shutterButtonDisabled: {
    backgroundColor: '#5A7A99',
    borderColor: '#5A7A99',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F1E8',
  },
  shutterInnerDisabled: {
    backgroundColor: '#5A7A99',
  },
  returnButton: {
    backgroundColor: '#5A7A99',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#1B3A57',
    padding: 16,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: '#F5F1E8',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerText: {
    color: '#F5F1E8',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
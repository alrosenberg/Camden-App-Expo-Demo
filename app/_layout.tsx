import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';

  import { useColorScheme } from '@/hooks/use-color-scheme';

  export const unstable_settings = {
    anchor: '(tabs)',
  };

  function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [progress] = useState(new Animated.Value(0));

    useEffect(() => {
      // Animate loading bar over 3 seconds
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start();

      // Hide splash screen after 3 seconds
      const timer = setTimeout(() => {
        onFinish();
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    const progressWidth = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.splashContainer}>
        {/* Decorative stars */}
        <Text style={[styles.splashStar, styles.splashStar1]}>⭐</Text>
        <Text style={[styles.splashStar, styles.splashStar2]}>⭐</Text>
        <Text style={[styles.splashStar, styles.splashStar3]}>⭐</Text>
        <Text style={[styles.splashStar, styles.splashStar4]}>⭐</Text>
        <Text style={[styles.splashStar, styles.splashStar5]}>⭐</Text>
        <Text style={[styles.splashStar, styles.splashStar6]}>⭐</Text>

        <Text style={styles.splashTitle}>Camden</Text>
        <Text style={styles.splashSubtitle}>Photo Assistant</Text>

        {/* Loading bar */}
        <View style={styles.loadingBarContainer}>
          <Animated.View style={[styles.loadingBar, { width: progressWidth 
  }]} />
        </View>
      </View>
    );
  }

  export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : 
  DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', 
  title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  const { width } = Dimensions.get('window');

  const styles = StyleSheet.create({
    splashContainer: {
      flex: 1,
      backgroundColor: '#1B3A57', // Navy blue
      justifyContent: 'center',
      alignItems: 'center',
    },
    splashTitle: {
      fontSize: 72,
      fontWeight: 'bold',
      color: '#F5F1E8', // Cream
      marginBottom: 10,
    },
    splashSubtitle: {
      fontSize: 20,
      color: '#F5F1E8', // Cream
      opacity: 0.8,
      marginBottom: 60,
    },
    loadingBarContainer: {
      width: width * 0.7,
      height: 6,
      backgroundColor: 'rgba(245, 241, 232, 0.3)', // Semi-transparent cream
      borderRadius: 3,
      overflow: 'hidden',
    },
    loadingBar: {
      height: '100%',
      backgroundColor: '#F5F1E8', // Cream
      borderRadius: 3,
    },
    splashStar: {
      position: 'absolute',
      fontSize: 20,
      opacity: 0.7,
    },
    splashStar1: {
      top: 100,
      left: 40,
      fontSize: 18,
    },
    splashStar2: {
      top: 200,
      right: 50,
      fontSize: 22,
    },
    splashStar3: {
      top: 500,
      left: 60,
      fontSize: 16,
    },
    splashStar4: {
      bottom: 150,
      right: 40,
      fontSize: 20,
    },
    splashStar5: {
      top: 350,
      left: 30,
      fontSize: 19,
    },
    splashStar6: {
      bottom: 250,
      right: 70,
      fontSize: 17,
    },
  });
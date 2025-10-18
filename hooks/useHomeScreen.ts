import { useState, useRef, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export const useHomeScreen = () => {
  const navigation = useNavigation();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasImage = capturedPhoto || selectedImage;
  const cameraRef = useRef<any>(null);

  // Animation values
  const actionButtonsOpacity = useRef(new Animated.Value(0)).current;
  const actionButtonsTranslateY = useRef(new Animated.Value(20)).current;
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const controlsScale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  
  // Corner frame animations
  const cornerPosition = useRef(new Animated.Value(15)).current; // 15 = inset, 0 = edge
  const cornerRadius = useRef(new Animated.Value(8)).current; // 8 = inset, 12 = edge

  // Reset state when screen comes into focus (after returning from Analysis)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen is focused, no need to do anything here
      // State is already reset in handleSubmit after navigation
    });

    return unsubscribe;
  }, [navigation]);

  // Animate when hasImage changes
  useEffect(() => {
    if (hasImage) {
      // Show action buttons, shrink and fade controls
      Animated.parallel([
        Animated.timing(actionButtonsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonsTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(controlsOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(controlsScale, {
          toValue: 0.85,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide action buttons, restore controls
      Animated.parallel([
        Animated.timing(actionButtonsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(actionButtonsTranslateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(controlsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(controlsScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [hasImage]);

  // Animate corners based on state
  // Corners are inset only at initial state, edges for everything else
  useEffect(() => {
    const isInitialState = !isCameraActive && !capturedPhoto && !selectedImage;
    
    if (isInitialState) {
      // Move corners inset (initial state only)
      Animated.parallel([
        Animated.spring(cornerPosition, {
          toValue: 15,
          tension: 50,
          friction: 7,
          useNativeDriver: false,
        }),
        Animated.timing(cornerRadius, {
          toValue: 8,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Move corners to edges (camera active, captured photo, or selected image)
      Animated.parallel([
        Animated.spring(cornerPosition, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: false,
        }),
        Animated.timing(cornerRadius, {
          toValue: 12,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isCameraActive, capturedPhoto, selectedImage]);

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        return;
      }
    }
    setIsCameraActive(true);
  };

  const handleCapturePhoto = async () => {
    if (isCameraActive && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });
        setCapturedPhoto(photo.uri);
        setIsCameraActive(false);
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const handleCancel = () => {
    // Fade out image first
    Animated.timing(imageOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // After fade out, reset state
      setSelectedImage(null);
      setCapturedPhoto(null);
      setIsCameraActive(false);
      // Fade image back in
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const imageToAnalyze = capturedPhoto || selectedImage;
    
    if (!imageToAnalyze) {
      setIsLoading(false);
      Alert.alert('Error', 'No image to analyze');
      return;
    }

    try {
      // Create FormData to send image to backend
      const formData = new FormData();
      
      // For React Native, we need to construct the file object properly
      const imageFile = {
        uri: imageToAnalyze,
        type: 'image/jpeg',
        name: 'chart.jpg',
      };
      
      // Append the image file
      formData.append('image', imageFile as any);

      // Send to backend
      const apiUrl = 'http://localhost:3000/api/analysis/chart';
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await apiResponse.json();

      if (result.success) {
        console.log('✅ Analysis successful:', result.description);
        
        // Navigate to Analysis screen with the result
        (navigation as any).navigate('Analysis', { 
          imageUri: imageToAnalyze,
          analysis: result 
        });
        
        // Reset state after navigation
        handleCancel();
      } else {
        Alert.alert('Error', result.error || 'Failed to analyze chart');
      }
    } catch (error: any) {
      console.error('❌ Error analyzing chart:', error);
      Alert.alert('Error', 'Failed to connect to analysis service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenGallery = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to access your photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setIsCameraActive(false);
      setCapturedPhoto(null);
    }
  };

  return {
    // State
    isCameraActive,
    selectedImage,
    capturedPhoto,
    isLoading,
    hasImage,
    cameraRef,
    
    // Animation values
    actionButtonsOpacity,
    actionButtonsTranslateY,
    controlsOpacity,
    controlsScale,
    imageOpacity,
    cornerPosition,
    cornerRadius,
    
    // Handlers
    handleTakePhoto,
    handleCapturePhoto,
    handleCancel,
    handleSubmit,
    handleOpenGallery,
  };
};

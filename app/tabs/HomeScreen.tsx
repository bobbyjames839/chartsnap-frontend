import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, ActivityIndicator } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { BlurView } from 'expo-blur';
import { CameraView } from 'expo-camera';
import { useHomeScreen } from '../../hooks/useHomeScreen';

export default function HomeScreen() {
  const {
    isCameraActive,
    selectedImage,
    capturedPhoto,
    isLoading,
    hasImage,
    cameraRef,
    actionButtonsOpacity,
    actionButtonsTranslateY,
    controlsOpacity,
    controlsScale,
    imageOpacity,
    cornerPosition,
    cornerRadius,
    handleTakePhoto,
    handleCapturePhoto,
    handleCancel,
    handleSubmit,
    handleOpenGallery,
  } = useHomeScreen();

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>ChartSnap AI</Text>
        <Text style={styles.subtitle}>Point your camera at any trading chart</Text>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <Animated.View style={[styles.imageWrapper, { opacity: imageOpacity }]}>
          {isCameraActive ? (
            <>
              {/* Active Camera */}
              <CameraView 
                ref={cameraRef}
                style={styles.camera}
                facing="back"
              />
            </>
          ) : capturedPhoto ? (
            <>
              {/* Captured Photo */}
              <Image 
                source={{ uri: capturedPhoto }}
                style={styles.chartImage}
                resizeMode="cover"
              />
            </>
          ) : selectedImage ? (
            <>
              {/* Selected Image from Gallery */}
              <Image 
                source={{ uri: selectedImage }}
                style={styles.chartImage}
                resizeMode="cover"
              />
            </>
          ) : (
            <>
              {/* Sample Chart Image */}
              <Image 
                source={require('../../assets/homelighter.png')}
                style={styles.chartImage}
                resizeMode="cover"
              />
              
              {/* Blur Overlay with Take Photo Button */}
              <BlurView intensity={30} style={styles.blurOverlay}>
                <TouchableOpacity 
                  style={styles.takePhotoButton}
                  onPress={handleTakePhoto}
                >
                  <AntDesign name="camera" size={32} color={colors.background} />
                  <Text style={styles.takePhotoText}>Take Photo</Text>
                </TouchableOpacity>
              </BlurView>
            </>
          )}
          
          {/* Animated Chart Frame Corners */}
          <Animated.View 
            style={[
              styles.frameTopLeft,
              {
                top: cornerPosition,
                left: cornerPosition,
                borderTopLeftRadius: cornerRadius,
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.frameTopRight,
              {
                top: cornerPosition,
                right: cornerPosition,
                borderTopRightRadius: cornerRadius,
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.frameBottomLeft,
              {
                bottom: cornerPosition,
                left: cornerPosition,
                borderBottomLeftRadius: cornerRadius,
              },
            ]} 
          />
          <Animated.View 
            style={[
              styles.frameBottomRight,
              {
                bottom: cornerPosition,
                right: cornerPosition,
                borderBottomRightRadius: cornerRadius,
              },
            ]} 
          />

          {/* Loading Overlay - Only over image */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <BlurView intensity={80} style={styles.loadingBlur}>
                <ActivityIndicator size="large" color={colors.green} />
                <Text style={styles.loadingText}>Analyzing Chart...</Text>
                <Text style={styles.loadingSubtext}>AI is processing your image</Text>
              </BlurView>
            </View>
          )}
        </Animated.View>

        {/* Action Buttons (Cancel/Submit) - Show when image is active */}
        {hasImage && (
          <Animated.View 
            style={[
              styles.actionButtons,
              {
                opacity: actionButtonsOpacity,
                transform: [{ translateY: actionButtonsTranslateY }],
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <AntDesign name="close" size={20} color={colors.lightest} />
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <AntDesign name="check" size={20} color={colors.background} />
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Bottom Controls */}
      <Animated.View 
        style={[
          styles.controls,
          {
            opacity: controlsOpacity,
            transform: [{ scale: controlsScale }],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.galleryButton}
          onPress={handleOpenGallery}
        >
          <AntDesign name="picture" size={24} color={colors.turquoise} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.captureButton,
            isCameraActive && styles.captureButtonActive
          ]}
          onPress={handleCapturePhoto}
          disabled={!isCameraActive}
        >
          <View 
            style={[
              styles.captureButtonInner,
              isCameraActive && styles.captureButtonInnerActive
            ]} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.flashButton}>
          <Feather name="zap-off" size={24} color={colors.turquoise} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 100,
  },
  titleContainer: {
    paddingHorizontal: 20,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.lightest,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.lighter,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageWrapper: {
    width: '90%',
    height: '70%',
    position: 'relative',
  },
  frameTopLeft: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.green,
  },
  frameTopRight: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.green,
  },
  frameBottomLeft: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: colors.green,
  },
  frameBottomRight: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: colors.green,
  },
  chartPlaceholder: {
    width: '70%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  camera: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  takePhotoButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  takePhotoText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: '700',
  },
  placeholderText: {
    color: colors.lighter,
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: colors.darker,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.lighter,
  },
  cancelText: {
    color: colors.lightest,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.darker,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.green,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  captureButtonActive: {
    opacity: 1,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.turquoise,
    borderWidth: 5,
    borderColor: colors.background,
    opacity: 0.5,
  },
  captureButtonInnerActive: {
    opacity: 1,
    backgroundColor: colors.green,
  },
  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.darker,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.green,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.lightest,
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 16,
    color: colors.lighter,
  },
});

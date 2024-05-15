import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import Orientation from 'react-native-orientation-locker';
import {
  useCameraDevices,
  Camera,
  PhysicalCameraDeviceType,
  CameraPermissionStatus,
} from 'react-native-vision-camera';
import Theme from '../../theme/Theme';

interface ICameraView {
  isVisible: boolean;
  onClose: () => void;
  selectedImages: ImageSourcePropType[];
  onMediaCapture: (path: string) => void;
  onConfirm: () => void;
}

const CameraView: React.FC<ICameraView> = props => {
  const [orientation, setOrientation] = useState<"portrait" | "portraitUpsideDown" | "landscapeLeft" | "landscapeRight" | undefined>('portrait'); // Set initial orientation to PORTRAIT
  const {isVisible, onClose, selectedImages, onMediaCapture, onConfirm} = props;
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  // const [cameraPosition, setCameraPosition] = useState<PhysicalCameraDeviceType>('ultra-wide-angle-camera');
  const [torch, setTorch] = useState<'on' | 'off'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false)
  const devices = useCameraDevices();
  console.log('====================================');
  console.log('devices :: ', JSON.stringify(devices));
  console.log('====================================');
  const device = devices.back;
  const camera = useRef<Camera>(null);

  const minZoom: any = device?.minZoom
  const maxZoom: any = device?.maxZoom

  let zoom0 = 0.5;
  let defaultZoom = 1;
  let zoom2 = 2;
  if (minZoom <= 0.5) {
    zoom0 = 0.5;
    defaultZoom = 1;
    zoom2 = 2;
  } else if (minZoom === 1 && maxZoom >= 2) {
    zoom0 = 1;
    defaultZoom = 1.25;
    zoom2 = 2.25;
  } 

  const [selectedZoom, setSelectedZoom] = useState<number>(1);
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Camera.requestCameraPermission().then(setCameraPermission);
  }, []);

  useEffect(() => {
    const mapOrientationToCameraOrientation = (orientation: string): string => {
      switch (orientation) {
        case "PORTRAIT":
          return "portrait";
        case "LANDSCAPE-LEFT":
          return "landscapeLeft";
        case "LANDSCAPE-RIGHT":
          return "landscapeRight";
        case "PORTRAIT-UPSIDEDOWN":
          return "portraitUpsideDown";
        default:
          return "portrait"; // Default to portrait orientation
      }
    };
  
    const onOrientationChange = (orientation: any) => {
      console.log('Orientation changed:', orientation);
      const cameraOrientation = mapOrientationToCameraOrientation(orientation);
      console.log('cameraOrientation:', cameraOrientation);
      setOrientation(cameraOrientation);

      Animated.timing(rotateValue, {
        toValue: cameraOrientation === 'landscapeLeft' ? 90 : cameraOrientation === 'landscapeRight' ? -90 : cameraOrientation === 'portraitUpsideDown' ? 180 : 0,
        duration: 500,
        useNativeDriver: true,
      }).start();


      if (camera.current) {
        // Adjust the camera orientation based on the device orientation
        
        // camera.current.props.orientation = cameraOrientation;
      }
    };
  
    Orientation.addOrientationListener(onOrientationChange);
  
    Orientation.unlockAllOrientations(); // Unlock all orientations
  
    return () => {
      Orientation.removeOrientationListener(onOrientationChange);
      Orientation.lockToPortrait(); // Lock orientation to PORTRAIT when unmounting
    };
  }, []);

  const toggleTorch = () => {
    setTorch(prevTorch => (prevTorch === 'on' ? 'off' : 'on'));
  };

  const onCapture = async () => {
    try {
      let rotation = 0;
      if (orientation === 'landscapeLeft') {
        rotation = -180;
      } else if (orientation === 'landscapeRight') {
        rotation = 180;
      } else if (orientation === 'portraitUpsideDown') {
        rotation = 0;
      }

      if (camera.current) {
        const photo = await camera.current.takePhoto({
          flash: torch,
          qualityPrioritization: 'quality'
        });

        const photoHeight = photo.height
        const photoWidth = photo.width

        let finalWidth, finalHeight;
        if (photoWidth > photoHeight) {
          finalWidth = photoHeight;
          finalHeight = photoHeight;
        } else if (photoHeight > photoWidth) {
          finalWidth = photoWidth;
          finalHeight = photoWidth;
        } else {
          // If both dimensions are equal, the image is already square
          finalWidth = photoWidth;
          finalHeight = photoHeight;
        }

        console.log("Final Width:", finalWidth);
        console.log("Final Height:", finalHeight);
  
        const resizedImage = await ImageResizer.createResizedImage(
          photo.path,
          finalWidth > 1000 ? 1000 : finalWidth, // Width
          finalHeight > 1000 ? 1000 : finalHeight, // Height
          'JPEG',
          100,
          rotation // Apply rotation when resizing the image
        );

        onMediaCapture(resizedImage.path);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (cameraPermission == null) {
    return null;
  }
  if (device == null || !isVisible) return null;

  const onChangeZoom = (count: any) => {
    setSelectedZoom(count)
  }

  // Interpolate the animated rotation value to rotate the view
  const interpolatedRotateAnimation = rotateValue.interpolate({
    inputRange: [-90, 0, 90, 180],
    outputRange: ['-90deg', '0deg', '90deg', '180deg'],
  });

  return (
    <>
      <Camera
        ref={camera}
        style={[StyleSheet.absoluteFill]}
        device={device}
        isActive={true}
        focusable={true}
        lowLightBoost={device.supportsLowLightBoost && enableNightMode}
        enableZoomGesture={true}
        torch={torch}
        zoom={selectedZoom}
        orientation={orientation} // Set the camera orientation
        photo={true}
        audio={true}
      />

      {/* <View style={[styles.viewAbsolute, {transform: [{ rotate: orientation === 'landscapeLeft' ? '-90deg' : orientation === 'landscapeRight' ? '90deg' : orientation === 'portraitUpsideDown' ? '180deg' : '0deg' }] }]}> */}
      <View style={[styles.viewAbsolute]}>
        <View style={styles.topButtonContainerStyle}>
          <View style={styles.viewRowSpace}>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={Theme.icons.CloseIconModal}
                style={styles.backImageStyle}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTorch}>
              <Image
                source={torch === 'on' ? Theme.icons.ic_flash : Theme.icons.ic_flash_off}
                style={styles.backImageStyle}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewEnd}>
            <TouchableOpacity onPress={() => setEnableNightMode(!enableNightMode)}>
              <Image
                source={enableNightMode ? Theme.icons.ic_moon : Theme.icons.ic_moon_outline}
                style={styles.backImageStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1}} />
        <View style={styles.bottomContainerStyle}>
          {/* <ScrollView
            horizontal={true}
            style={styles.selectedImagesRow}
            showsHorizontalScrollIndicator={false}>
            {selectedImages &&
              selectedImages.map((item: any, index: number) => {
                return (
                  <View style={styles.selectedImageContainerStyle} key={index}>
                    <Image
                      source={{uri: `data:image/png;base64,${item.uri}`}}
                      style={styles.selectedImageStyle}
                      resizeMode={'cover'}
                    />
                  </View>
                );
              })}
          </ScrollView> */}
          <View style={styles.viewRowCenter}>
            <TouchableOpacity
              style={styles.marginH5}
              onPress={() => {
                onChangeZoom(zoom0);
              }}>
              <View
                style={
                  selectedZoom === zoom0
                    ? styles.viewSelectedZoom
                    : styles.viewUnSelectedZoom
                }>
                <Text
                  style={
                    selectedZoom === zoom0
                      ? styles.textSelectedZoom
                      : styles.textUnSelectedZoom
                  }>{`0.5${selectedZoom === zoom0 ? 'x' : ''}`}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.marginH5}
              onPress={() => {
                onChangeZoom(defaultZoom);
              }}>
              <View
                style={
                  selectedZoom === defaultZoom
                    ? styles.viewSelectedZoom
                    : styles.viewUnSelectedZoom
                }>
                <Text
                  style={
                    selectedZoom === defaultZoom
                      ? styles.textSelectedZoom
                      : styles.textUnSelectedZoom
                  }>{`1${selectedZoom === defaultZoom ? 'x' : ''}`}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.marginH5}
              onPress={() => {
                onChangeZoom(zoom2);
              }}>
              <View
                style={
                  selectedZoom === zoom2
                    ? styles.viewSelectedZoom
                    : styles.viewUnSelectedZoom
                }>
                <Text
                  style={
                    selectedZoom === zoom2
                      ? styles.textSelectedZoom
                      : styles.textUnSelectedZoom
                  }>{`2${selectedZoom === zoom2 ? 'x' : ''}`}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={styles.viewImage}>
              {selectedImages.length>0? (
                <Animated.View style={{ transform: [{ rotate: interpolatedRotateAnimation }]}}>
                  <Image
                    source={{uri: `data:image/png;base64,${selectedImages[0].image}`}}
                    style={styles.selectedImages}
                    resizeMode={'cover'}
                  />
                  <View style={styles.viewSelected}>
                    <Text style={styles.selectedImagesCount}>
                      {selectedImages.length}
                    </Text>
                  </View>
                </Animated.View>
              ):null}
            </View>
            <View style={styles.centeredIcon}>
              <TouchableOpacity
                style={styles.captureButtonContainerStyle}
                onPress={onCapture}>
                <View style={styles.captureButtonInnerStyle} />
              </TouchableOpacity>
            </View>
            <View style={styles.viewImage}>
              <TouchableOpacity onPress={onConfirm}>
                <Image source={Theme.icons.ic_check} style={styles.rightIcons} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default CameraView;

const styles = StyleSheet.create({
  viewAbsolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  bottomContainerStyle: {
    bottom: 0,
    width: '100%',
  },
  captureButtonContainerStyle: {
    height: Theme.responsiveSize.size50,
    width: Theme.responsiveSize.size50,
    borderRadius: Theme.responsiveSize.size100,
    borderWidth: Theme.responsiveSize.size1,
    borderColor: Theme.colors.borderColor1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInnerStyle: {
    height: Theme.responsiveSize.size40,
    width: Theme.responsiveSize.size40,
    borderRadius: Theme.responsiveSize.size100,
    backgroundColor: Theme.colors.bgColor2,
  },
  topButtonContainerStyle: {
    width: '100%',
    top: Theme.responsiveSize.size20,
    paddingHorizontal: Theme.responsiveSize.size20,
  },
  viewRowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewEnd: {
    alignItems: 'flex-end',
    marginTop: Theme.responsiveSize.size25,
  },
  bottomButtonContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImagesRow: {
    marginBottom: Theme.responsiveSize.size15,
  },
  selectedImageContainerStyle: {
    height: Theme.responsiveSize.size60,
    width: Theme.responsiveSize.size60,
    marginHorizontal: Theme.responsiveSize.size5,
  },
  selectedImageStyle: {
    height: '100%',
    width: '100%',
  },
  backImageStyle: {
    height: Theme.responsiveSize.size20,
    width: Theme.responsiveSize.size20,
    tintColor: Theme.colors.bgColor1,
  },
  rightIcons: {
    height: Theme.responsiveSize.size30,
    width: Theme.responsiveSize.size30,
    marginRight: '3%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.responsiveSize.size10,
  },
  centeredIcon: {
    flex: Theme.responsiveSize.size1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewImage: {
    height: Theme.responsiveSize.size80,
    width: Theme.responsiveSize.size80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImages: {
    height: Theme.responsiveSize.size55,
    width: Theme.responsiveSize.size55,
    borderRadius: Theme.responsiveSize.size100,
  },
  viewSelected: {
    position: 'absolute',
    height: Theme.responsiveSize.size55,
    width: Theme.responsiveSize.size55,
    borderRadius: Theme.responsiveSize.size100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000095'
  },
  selectedImagesCount: {
    color: Theme.colors.textColor1,
    fontSize: Theme.responsiveSize.size18,
  },
  viewRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginH5: {
    marginHorizontal: Theme.responsiveSize.size5,
    marginBottom: Theme.responsiveSize.size5,
  },
  viewSelectedZoom: {
    height: Theme.responsiveSize.size32,
    width: Theme.responsiveSize.size32,
    backgroundColor: Theme.colors.bgColor1,
    borderRadius: Theme.responsiveSize.size50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  viewUnSelectedZoom: {
    height: Theme.responsiveSize.size32,
    width: Theme.responsiveSize.size32,
    backgroundColor: '#000000d9',
    borderRadius: Theme.responsiveSize.size50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textSelectedZoom: {
    color: Theme.colors.textColor1,
    fontSize: Theme.responsiveSize.size10,
    lineHeight: Theme.responsiveSize.size14,
  },
  textUnSelectedZoom: {
    color: Theme.colors.textColor1,
    fontSize: Theme.responsiveSize.size10,
    lineHeight: Theme.responsiveSize.size14,
  },
});

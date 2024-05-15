import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {launchCamera} from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import {checkPermission, requestPermission} from '../../permission/Permission';
import {ButtonFill} from '../../components/Button';
import {CameraView} from '../../components/Camera';
import styles from './styles';

const HomeScreen = (props: any) => {
  const [listOfImg, setListOfImg] = useState<any[]>([]);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);

  const openCamera = async (id: number) => {
    const data: any = await checkPermission();
    console.log('data :: ', JSON.stringify(data));
    if (data.status === false) {
      const request = await requestPermission();
      console.log('request :: ', JSON.stringify(request));
      if (data.status === true) {
        doGetCamera(id)
      }
    } else {
      doGetCamera(id)
    }
    
  }

  const doGetCamera = (id: number) => {
    if (id === 1) {
      launchCamera({
        mediaType: 'photo',
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 1,
        cameraType: 'back',
      }, (response) => {
        props.navigation.navigate('CameraScreen', {image: response?.assets[0].uri, list: false})
      });
    } else if (id === 2) {
      ImagePicker.openCamera({
        mediaType: 'photo',
        width: 1000,
        height: 1000,
        quality: 1,
        cameraType: 'back',
        cropping: true,
      },).then((response) => {
        props.navigation.navigate('CameraScreen', {image: response?.path, list: false})
      });
    } else {
      setIsCameraVisible(true)
    }
  }

  return (
    <SafeAreaView style={styles.viewSafeContainer}>
      <View style={styles.viewContainer}>
        <ButtonFill
          title={'Camera Picker'}
          onPress={() => {
            openCamera(1)
          }}
        />
        <ButtonFill
          title={'Crop Image Picker'}
          onPress={() => {
            openCamera(2)
          }}
        />
        <ButtonFill
          title={'Custom Camera'}
          onPress={() => {
            openCamera(3)
          }}
        />
        <CameraView
          isVisible={isCameraVisible}
          selectedImages={listOfImg}
          onMediaCapture={e => {
            ImgToBase64.getBase64String(`file:${e}`)
              .then(async (base64String: string) => {
                const newItemImgList: any = [...listOfImg];
                newItemImgList.push({image: base64String});
                setListOfImg(newItemImgList);
              })
              .catch((err: any) => console.log('Concern img error : ', err));
          }}
          onConfirm={() => {
            setIsCameraVisible(false);
            props.navigation.navigate('CameraScreen', {image: listOfImg, list: true})
          }}
          onClose={() => {
            setIsCameraVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen;

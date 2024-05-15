import React, { useEffect, useState } from 'react';
import { FlatList, Image, ListRenderItem, SafeAreaView, View } from 'react-native';
import styles from './styles';

const CameraScreen = (props: any) => {
  const [isList, setIsList] = useState<boolean>(false);
  const [mainImage, setMainImage] = useState();
  const [listOfImages, setListOfImages] = useState<any[]>([]);

  useEffect(() => {
    const {image, list} = props.route.params;
    setIsList(list)
    if (list) {
      setListOfImages(image)
    } else {
      setMainImage(image)
    }
  }, [])
  
  const renderItem: ListRenderItem<any> = ({item, index}) => {
    console.log('item :: ', item);
    
    return (
      <Image
        source={{uri: `data:image/png;base64,${item.image}`}}
        resizeMode={'contain'}
        style={styles.imageList}
      />
    );
  }

  return (
    <SafeAreaView style={styles.viewSafeContainer}>
      <View style={styles.viewContainer}>
        {isList ? (
          <FlatList
            data={listOfImages}
            renderItem={renderItem}
            keyExtractor={(item, index) => (index+1).toString()}
          />
        ): (
          <Image
            source={{uri: mainImage}}
            resizeMode={'contain'}
            style={styles.imageMain}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default CameraScreen;

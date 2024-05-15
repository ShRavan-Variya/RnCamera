import { Dimensions, StyleSheet } from "react-native";

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
  viewSafeContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  viewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageMain: {
    height: '100%',
    width: '100%',
  },
  imageList: {
    width: width,
    height: width,
  },
})

export default styles;
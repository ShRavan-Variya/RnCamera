import { StyleSheet } from "react-native";
import Theme from "../../theme/Theme";


const styles = StyleSheet.create({
  viewSafeContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  viewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Theme.responsiveSize.size15,
    paddingVertical: Theme.responsiveSize.size15,
  },
})

export default styles;
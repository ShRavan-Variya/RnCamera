import { StyleSheet } from "react-native";
import Theme from "../../theme/Theme";

const styles = StyleSheet.create({
  bgStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Theme.responsiveSize.size5,
    backgroundColor: Theme.colors.bgColor3,
    paddingHorizontal: Theme.responsiveSize.size15,
    paddingVertical: Theme.responsiveSize.size10,
    borderRadius: Theme.responsiveSize.size5,
  },
  textStyle: {
    fontWeight: '500',
    color: Theme.colors.textColor1,
    fontSize: Theme.responsiveSize.size15,
  },
})

export default styles;

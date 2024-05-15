import {RFValue} from "react-native-responsive-fontsize";


const Theme = {
  colors: {
    bgColor1: '#000000',
    bgColor2: '#FFFFFF',
    bgColor3: '#261FED',

    borderColor1: '#FFFFFF',

    textColor1: '#FFFFFF',
  },
  responsiveSize: {
    size1: RFValue(1),
    size5: RFValue(5),
    size10: RFValue(10),
    size14: RFValue(14),
    size15: RFValue(15),
    size18: RFValue(18),
    size20: RFValue(20),
    size25: RFValue(25),
    size30: RFValue(30),
    size32: RFValue(32),
    size40: RFValue(40),
    size50: RFValue(50),
    size55: RFValue(55),
    size60: RFValue(60),
    size80: RFValue(80),
    size100: RFValue(100),
  },
  icons: {
    CloseIconModal: require('../resources/CloseIconModal.png'),
    ic_flash: require('../resources/ic_flash.png'),
    ic_flash_off: require('../resources/ic_flash_off.png'),
    ic_moon: require('../resources/ic_moon.png'),
    ic_moon_outline: require('../resources/ic_moon_outline.png'),
    ic_check: require('../resources/ic_check.png'),
  },
}

export default Theme;

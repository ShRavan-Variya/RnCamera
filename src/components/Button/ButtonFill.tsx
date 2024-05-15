import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import styles from "./styles"

interface ButtonFillProps {
  title: string;
  onPress: () => void;
}

const ButtonFill = (props: ButtonFillProps) => {
  return(
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.bgStyle}>
        <Text style={styles.textStyle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ButtonFill;

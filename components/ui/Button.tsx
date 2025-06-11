'use strict';

import React from 'react';
import ReactNative from 'react-native';

const {Platform, View, StyleSheet, Pressable, Text, Image, findNodeHandle} = ReactNative;

exports.framework = 'React';
exports.title = 'DirectionalNextFocus example';
exports.description = 'tvOS nextFocus';
// exports.examples = [
//   {
//     title: 'DirectionalNextFocus',
//     render(): React.Node {
//       return <DirectionalNextFocusExample />;
//     },
//   },
// ];

import type { ImageSourcePropType } from 'react-native';

type ButtonProps = React.ComponentProps<typeof Pressable> & {
  label: string;
  style?: any;
  image: ImageSourcePropType;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;

  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
  nextFocusUp?: number;
  nextFocusDown?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
};

export const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>((props, ref) => {
  return (
          <Pressable
            onPress={props.onPress}
            style={[
              props.style
            ]}
            ref={ref}
            // hasTVPreferredFocus={props.hasTVPreferredFocus || false}
            // nextFocusUp={props.nextFocusUp}
            // nextFocusDown={props.nextFocusDown}
            // nextFocusLeft={props.nextFocusLeft}
            // nextFocusRight={props.nextFocusRight}
          >
              <View>
                <Image
                  source={props.image}
                  style={styles.buttonIcon}
                  accessibilityLabel="Iniciar a produção"
                />
                <Text style={styles.buttonText}>{props.label}</Text>
              </View>
          </Pressable>
  );
});

const styles = StyleSheet.create({
buttonIcon: {
  height: 54,
  width: 54,
  marginBottom: 18
},
buttonText: {
  color: '#fff',
  fontSize: 18,
},

});

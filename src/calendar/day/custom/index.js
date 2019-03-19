import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';
import { shouldUpdate } from '../../../component-updater';

class Day extends Component {
  static propTypes = {
    // TODO: disabled props should be removed
    state: PropTypes.oneOf(['selected', 'disabled', 'today', '']),

    // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
    marking: PropTypes.any,
    onPress: PropTypes.func,
    date: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
    this.onDayLongPress = this.onDayLongPress.bind(this);
  }

  onDayPress() {
    this.props.onPress(this.props.date);
  }
  onDayLongPress() {
    this.props.onLongPress(this.props.date);
  }

  shouldComponentUpdate(nextProps) {
    return shouldUpdate(this.props, nextProps, [
      'state',
      'children',
      'marking',
      'onPress',
      'onLongPress'
    ]);
  }

  render() {
    let containerStyle = [this.style.base];
    let textStyle = [this.style.text];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true
      };
    }
    const isDisabled =
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled';

    if (marking.selected) {
      containerStyle.push(this.style.selected);
    } else if (isDisabled) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      containerStyle.push(this.style.today);
      textStyle.push(this.style.todayText);
    }

    if (marking.customStyles && typeof marking.customStyles === 'object') {
      const styles = marking.customStyles;
      if (styles.container) {
        if (styles.container.borderRadius === undefined) {
          styles.container.borderRadius = 16;
        }
        containerStyle.push(styles.container);
      }
      if (styles.text) {
        textStyle.push(styles.text);
      }
    }
    return (
      <View
        style={{
          paddingBottom: 7,
          paddingTop: 7,
          paddingLeft: 7,
          paddingRight: 7
        }}
      >
        <TouchableOpacity
          style={[containerStyle]}
          onPress={this.onDayPress}
          onLongPress={this.onDayLongPress}
          activeOpacity={marking.activeOpacity}
          disabled={
            containerStyle[1] != undefined && containerStyle[2] != undefined
              ? true
              : marking.disableTouchEvent
          }
        >
          <Text allowFontScaling={false} style={[textStyle, { fontSize: 15 }]}>
            {String(this.props.children)}
          </Text>
          <View
            style={{
              opacity:
                (containerStyle[1] != undefined &&
                  containerStyle[1].backgroundColor == 'transparent') ||
                (containerStyle[2] != undefined &&
                  containerStyle[2].backgroundColor == 'transparent')
                  ? 1
                  : 0,
              position: 'absolute',
              transform: [{ rotate: '-45deg' }],
              top: 15,
              width: 25,
              height: 1,
              borderBottomColor: '#f00',
              borderBottomWidth: 2
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            opacity:
              containerStyle[1] != undefined &&
              containerStyle[1].backgroundColor == '#1b2e50'
                ? 1
                : 0,
            position: 'absolute',
            left: 30,
            bottom: 30,
            zIndex: 9999,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f00',
            width: 20,
            height: 20,
            borderRadius: 10
          }}
        >
          <Text style={{ color: 'white', fontSize: 8 }}>
            {this.props.marking.count > 9 ? '9+' : this.props.marking.count}
          </Text>
        </View>
      </View>
    );
  }
}

export default Day;

import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW
} from '../../testIDs';

const { height, width } = Dimensions.get('window');

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy'
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={CHANGE_MONTH_LEFT_ARROW}
        >
          {this.props.renderArrow ? (
            this.props.renderArrow('left')
          ) : (
            <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={CHANGE_MONTH_RIGHT_ARROW}
        >
          {this.props.renderArrow ? (
            this.props.renderArrow('right')
          ) : (
            <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }
    return (
      <View>
        {!this.props.hideDayNames && (
          <View
            style={[
              this.style.week,
              {
                backgroundColor: '#e7e9ed',
                width: width
              }
            ]}
          >
            {this.props.weekNumbers && (
              <Text allowFontScaling={false} style={this.style.dayHeader} />
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                accessible={false}
                style={[this.style.dayHeader, { marginTop: 8 }]}
                numberOfLines={1}
                importantForAccessibility="no"
              >
                {day.slice(0, -2)}
              </Text>
            ))}
          </View>
        )}
        <View
          style={[
            this.style.header,
            {
              flexDirection: 'row',
              justifyContent: 'flex-end'
            }
          ]}
        >
          {leftArrow}
          <View>
            <Text
              allowFontScaling={false}
              style={[
                this.style.monthText,
                { fontWeight: 'bold', fontSize: 18 }
              ]}
              accessibilityTraits="header"
            >
              {this.props.month.toString(this.props.monthFormat).split(' ')[0]}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
      </View>
    );
  }
}

let konzultaStyle = StyleSheet.create({});

export default CalendarHeader;

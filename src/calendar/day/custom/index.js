import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Image, Modal, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import styleConstructor from './style';
import { shouldUpdate } from '../../../component-updater';

const { height, width } = Dimensions.get('window');

class Day extends Component {
	static propTypes = {
		// TODO: disabled props should be removed
		state: PropTypes.oneOf([
			'selected',
			'disabled',
			'today',
			''
		]),

		// Specify theme properties to override specific styles for calendar parts. Default = {}
		theme: PropTypes.object,
		marking: PropTypes.any,
		onPress: PropTypes.func,
		date: PropTypes.object,
		pressAvailable: PropTypes.func
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

	onPressAppointment = (time) => {
		this.props.pressAppointment(this.props.date, time);
	};

	onPressAvailable = (time) => {
		this.props.pressAvailable(this.props.date, time);
	};

	render() {
		let containerStyle = [
			this.style.base
		];
		let textStyle = [
			this.style.text
		];

		let marking = this.props.marking || {};
		if (marking && marking.constructor === Array && marking.length) {
			marking = {
				marking: true
			};
		}
		const isDisabled = typeof marking.disabled !== 'undefined' ? marking.disabled : this.props.state === 'disabled';

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
		let type =
				marking.customStyles != undefined && marking.customStyles.type != undefined
					? marking.customStyles.type
					: undefined,
			time = type != undefined ? marking.customStyles.time : undefined;
		return (
			<View
				style={{
					padding: 7
				}}
			>
				<TouchableOpacity
					style={[
						containerStyle
					]}
					onPress={
						(type != undefined && type == 'available') || type == 'appointment' ? type == 'appointment' ? (
							() => {
								this.onPressAppointment(time);
							}
						) : (
							() => {
								this.onPressAvailable(time);
							}
						) : (
							this.onDayPress
						)
					}
					onLongPress={this.onDayLongPress}
					activeOpacity={marking.activeOpacity}
					disabled={type != undefined && type == 'unavailable' ? true : marking.disableTouchEvent}
				>
					<Text
						allowFontScaling={false}
						style={[
							textStyle,
							{ fontSize: 15 }
						]}
					>
						{String(this.props.children)}
					</Text>
					<View
						style={{
							opacity: type != undefined && type == 'unavailable' ? 1 : 0,
							position: 'absolute',
							transform: [
								{ rotate: '-45deg' }
							],
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
						opacity: type != undefined && type == 'appointment' ? 1 : 0,
						position: 'absolute',
						left: 30,
						bottom: 30,
						zIndex: 9999,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#f00',
						width: 15,
						height: 15,
						borderRadius: 10
					}}
				>
					<Text style={{ color: 'white', fontSize: 8 }}>
						{this.props.marking.count > 9 ? '9+' : this.props.marking.count}
					</Text>
				</View>
				<View
					style={{
						opacity: type != undefined && type == 'available' ? 1 : 0,
						position: 'absolute',
						left: 30,
						bottom: 30,
						zIndex: 9999,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Image
						source={require('../../img/clock-2.png')}
						style={{ height: 13, width: 13, tintColor: '#1b2e50' }}
					/>
				</View>
			</View>
		);
	}
}

export default Day;

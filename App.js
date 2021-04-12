import * as React from 'react';
import {View, Text,StyleSheet} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import TransactionScreen from './screens/transaction'
import SearchScreen from './screens/search'
export default class App extends React.Component {
    render(){
        return (
            <AppContainer/>
        )
    }
}
var TabNavigator = createBottomTabNavigator({
 TransactionScreen:TransactionScreen,
 SearchScreen:SearchScreen,

})
var AppContainer= createAppContainer(TabNavigator);
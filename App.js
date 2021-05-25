import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import TransactionScreen from './screens/transaction'
import SearchScreen from './screens/search'
import Login from "./screens/login"
export default class App extends React.Component {
    render() {
        return (
            <AppContainer />
        )
    }
}
var TabNavigator = createBottomTabNavigator({
    TransactionScreen: TransactionScreen,
    SearchScreen: SearchScreen,

},
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: () => {
                const routeName = navigation.state.routeName
                if (routeName === "TransactionScreen") {
                    return (
                        <Image source={require("./assets/book.png")} style={{ width: 30, height: 30 }} />

                    )
                } else if (routeName === "SearchScreen") {
                    return (
                        <Image source={require("./assets/searchingbook.png")} style={{ width: 30, height: 30 }} />

                    )
                }

            }
        })
    })
var SwitchNavigator=createSwitchNavigator({
    Login:Login,
    Home:TabNavigator,
})
var AppContainer = createAppContainer(SwitchNavigator);
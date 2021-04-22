import * as React from 'react';
import {View, Text,StyleSheet} from 'react-native';

export default class SearchScreen extends React.Component {
    render(){
        return (
            <View style={styles.container}>

                <Text>SearchScreen</Text>
            </View>
        )
    }
}
const styles= StyleSheet.create(
    {
        container:{
            alignItems:'center',
            justifyContent:'center',

        }
    }
) 
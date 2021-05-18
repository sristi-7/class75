import * as React from 'react';
import {View, Text,StyleSheet,FlatList,TextInput,TouchableOpacity} from 'react-native';
import db from '../config';
import{ScrollView} from 'react-native-gesture-handler';


export default class SearchScreen extends React.Component {
    constructor(){
        super()
        this.state={
            allTransactions:[],
                    }
    }
    componentDidMount= async()=>{
        const query= await db.collection("Transactions").get()
        query.docs.map(doc=>{
            this.setState({
                allTransactions:[...this.state.allTransactions,doc.data()]
            })
        })
    }
    render(){

        return (
            <View style={styles.container}>

                <Text>SearchScreen</Text>
                <FlatList
                data={this.state.allTransactions}
                keyExtractor={(item,index)=>index.toString()}
                renderItem={(item)=>(
                    <View style={{borderBottomWidth:2}}>
                        <Text>{"BookID:"+item.BookID}</Text>
                        <Text>{"StudentID:"+item.StudentID}</Text>
                        
                    </View>
                )}
                ></FlatList>
            </View>
        )
    }
}
const styles= StyleSheet.create(
    {
        container:{
           
            justifyContent:'center',

        }
    }
) 
import * as React from 'react';
import {View, Text,StyleSheet,TouchableOpacity,TextInput} from 'react-native';
import * as Permissions from "expo-permissions"
import {BarCodeScanner} from "expo-barcode-scanner"

export default class TransactionScreen extends React.Component {
    constructor(){
        super()
        this.state={
            hasCameraPermission:null,
            scanned:false,
            scannedStudentID: "",
            buttonState:"normal",
            scanBookID:"",
            

        }
    }
    getCameraPermissions=async(ID)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission: status==="granted",
            buttonState:ID,
            scanned:false,

        })
    }
    handleBarCodeScanner=async({type,data})=>{
        if (this.state.buttonState==="bookID"){
            this.setState({
                scanned:true,
                scannedBookID:data,
                buttonState:"normal",
            })
        }else  if (this.state.buttonState==="studentID"){
            this.setState({
                scanned:true,
                scannedStudentID:data,
                buttonState:"normal",
            })
        }
        
    }
    render(){
        if(this.state.buttonState!=="normal" && this.state.hasCameraPermission){
            return (
                <BarCodeScanner 
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={this.state.scanned?(
                    undefined
                ):(
                    this.handleBarCodeScanner()
                )}/>
            )
        } else if(this.state.buttonState==="normal"){
        return (

            <View style={styles.container}>
                <View>
                    <TextInput placeholder="bookID" value={this.state.scannedBookID}/>
                    <TouchableOpacity onPress={()=>{this.getCameraPermissions("bookID")}}>
                    <Text>scan</Text>
                </TouchableOpacity>
                </View>
                <View>
                    <TextInput placeholder="studentID" value={this.state.scannedStudentID}/>
                    <TouchableOpacity onPress={()=>{this.getCameraPermissions("studentID")}}>
                    <Text>scan</Text>
                </TouchableOpacity>
                </View>
                <Text>{this.state.hasCameraPermission==true?(
                    this.state.scannedData
                ):("requestCameraPosition")}</Text>
                <Text>TransactionScreen</Text>
                
            </View>
        )}
    }
}
const styles= StyleSheet.create(
    {
        container:{
            alignItems:'center',
            marginTop:100,

        }
    }
) 
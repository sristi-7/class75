import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Permissions from "expo-permissions"
import { BarCodeScanner } from "expo-barcode-scanner"
import * as firebase from "firebase"
import db from '../config';

export default class TransactionScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            scannedStudentID: "",
            buttonState: "normal",
            scanBookID: "",
            transactionMessage: "",

        }
    }
    getCameraPermissions = async (ID) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission: status === "granted",
            buttonState: ID,
            scanned: false,

        })
    }
    handleBarCodeScanner = async ({ type, data }) => {
        if (this.state.buttonState === "bookID") {
            this.setState({
                scanned: true,
                scannedBookID: data,
                buttonState: "normal",
            })
        } else if (this.state.buttonState === "studentID") {
            this.setState({
                scanned: true,
                scannedStudentID: data,
                buttonState: "normal",
            })
        }

    }
    initiateBookIssue = async () => {
        db.collection("Transactions").add({
            studentId: this.state.scannedStudentID,
            bookId: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "issue"
        })
        db.collection("Books").doc(this.state.scannedBookID).update({
            bookAvailability: false,

        })
        db.collection("Students").doc(this.state.scannedStudentId).update({
            NoOfBooksIssued: firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert("bookissued")
        this.setState({
            scannedBookID: "",
            scannedStudentID: "",
        })
    }
    initiateBookReturn = async () => {
        db.collection("Transactions").add({
            studentId: this.state.scannedStudentID,
            bookId: this.state.scannedBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "return"
        })
        db.collection("Books").doc(this.state.scannedBookID).update({
            bookAvailability: true,

        })
        db.collection("Students").doc(this.state.scannedStudentId).update({
            NoOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert("bookreturn")
        this.setState({
            scannedBookID: "",
            scannedStudentID: "",
        })
    }
    handleTransactions = () => {
        var transactionMessage
        db.collection("Books").doc(this.state.scannedBookID).get().then(
            (doc) => {
                var book = doc.data()
                if (book.bookAvailability) {
                    this.initiateBookIssue()
                    transactionMessage = "BookIssued"
                }
                else {
                    this.initiateBookReturn()
                    transactionMessage = "BookReturned"
                }

            }
        )
        this.setState(
            {
                transactionMessage: transactionMessage
            }
        )
    }
    render() {
        if (this.state.buttonState !== "normal" && this.state.hasCameraPermission) {
            return (
                <BarCodeScanner
                    style={StyleSheet.absoluteFillObject}
                    onBarCodeScanned={this.state.scanned ? (
                        undefined
                    ) : (
                        this.handleBarCodeScanner()
                    )} />
            )
        } else if (this.state.buttonState === "normal") {
            return (

                <View style={styles.container}>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput style={styles.textInput} placeholder="bookID" value={this.state.scannedBookID} />
                        <TouchableOpacity style={styles.button} onPress={() => { this.getCameraPermissions("bookID") }}>
                            <Text>scan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput style={styles.textInput} placeholder="studentID" value={this.state.scannedStudentID} />
                        <TouchableOpacity style={styles.button} onPress={() => { this.getCameraPermissions("studentID") }}>
                            <Text>scan</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>{this.state.hasCameraPermission == true ? (
                        this.state.scannedData
                    ) : ("requestCameraPosition")}</Text>
                    <Text>TransactionScreen</Text>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {
                            this.handleTransactions()
                        }}>
                        <Text>submit</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create(
    {
        container: {
            alignItems: 'center',
            marginTop: 100,

        },
        textInput: {
            borderWidth: 0.5,
            padding: 10,
            fontSize: 15,
            width: "50%", marginTop: 10, marginRight: 5,
            //fontFamily:
        }, button: {
            backgroundColor: "yellow",
            borderRadius: 5,
            padding: 10,
            width: "20%", marginTop: 10, marginRight: 5,
            alignItems: "center",
            justifyContent: "center",



        }

    }
)
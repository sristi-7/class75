import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as firebase from "firebase";
import db from "../config";

export default class TransactionScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      hasCameraPermission: null,
      scanned: false,
      scannedStudentID: "",
      buttonState: "normal",
      scanBookID: "",
      transactionMessage: "",
    };
  }
  getCameraPermissions = async (ID) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === "granted",
      buttonState: ID,
      scanned: false,
    });
  };
  handleBarCodeScanner = async ({ type, data }) => {
    if (this.state.buttonState === "bookID") {
      this.setState({
        scanned: true,
        scannedBookID: data,
        buttonState: "normal",
      });
    } else if (this.state.buttonState === "studentID") {
      this.setState({
        scanned: true,
        scannedStudentID: data,
        buttonState: "normal",
      });
    }
  };
  initiateBookIssue = async () => {
    db.collection("Transactions").add({
      StudentID: this.state.scannedStudentID,
      BookID: this.state.scannedBookID,
      Date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "issued",
    });
    db.collection("Books").doc(this.state.scannedBookID).update({
      bookAvailability: false,
    });
    db.collection("Students")
      .doc(this.state.scannedStudentID)
      .update({
        NoOfBooksIssued: firebase.firestore.FieldValue.increment(1),
      });
    ToastAndroid.show("book issued", ToastAndroid.LONG);
    this.setState({
      scannedBookID: "",
      scannedStudentID: "",
    });
  };
  checkBookAvailability = async () => {
    const bookRef = await db
      .collection("Books")
      .where("BookID", "==", this.state.scannedBookID)
      .get();
    var transactionType = "";
    if (bookRef.docs.length == 0) {
      transactionType = false;
    } else {
      bookRef.docs.map((doc) => {
        var book = doc.data();
        if (book.bookAvailability) {
          transactionType = "issued";
        } else {
          transactionType = "return";
        }
      });
      
    }

    return transactionType;
  };
  initiateBookReturn = async () => {
    db.collection("Transactions").add({
      StudentID: this.state.scannedStudentID,
      BookID: this.state.scannedBookID,
      Date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "return",
    });
    db.collection("Books").doc(this.state.scannedBookID).update({
      bookAvailability: true,
    });
    db.collection("Students")
      .doc(this.state.scannedStudentID)
      .update({
        NoOfBooksIssued: firebase.firestore.FieldValue.increment(-1),
      });
    ToastAndroid.show("book returned", ToastAndroid.LONG);
    this.setState({
      scannedBookID: "",
      scannedStudentID: "",
    });
  };
  checkStudentEligibilityForBookIssue = async () => {
    const studentRef = await db
      .collection("Students")
      .where("StudentID", "==", this.state.scannedStudentID)
      .get();
    var isStudentEligible = "";
    if (studentRef.docs.length == 0) {
      ToastAndroid.show("student ID doesn't exist", ToastAndroid.LONG);
      isStudentEligible = false;
      this.setState({
        scannedBookID: "",
        scannedStudentID: "",
      });
    } else {
      studentRef.docs.map((doc) => {
        var student = doc.data();
        if (student.NoOfBooksIssued < 2) {
          isStudentEligible = true;
        } else {
          ToastAndroid.show("already issued a book", ToastAndroid.LONG);
          isStudentEligible = false;
          this.setState({
            scannedBookID: "",
            scannedStudentID: "",
          });
        }
      });
    }
    return isStudentEligible
  };
  checkStudentEligibilityForBookReturned= async()=>{
    const studentRef = await db
    .collection("Transactions")
      .where("BookID", "==", this.state.scannedBookID).limit(1)
      .get();
    var isStudentEligible=""
    studentRef.docs.map(doc=>{
      
      var lastBookTransaction=doc.data() 
    if(lastBookTransaction.StudentID===this.state.scannedStudentID){
      isStudentEligible=true
    }else{
      isStudentEligible=false
      ToastAndroid.show("this book wasn't issued by the student", ToastAndroid.LONG);
      this.setState({
        scannedBookID: "",
        scannedStudentID: "",
      });
    }
    })
     return isStudentEligible 
  }
  handleTransactions = async () => {
    var transactionType = await this.checkBookAvailability();
    if (!transactionType) {
      ToastAndroid.show("book does not exist in library", ToastAndroid.SHORT);
      this.setState({
        scannedBookID: "",
        scannedStudentID: "",
      });
    } else if (transactionType === "issued") {
      var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
      if (isStudentEligible) {
        this.initiateBookIssue();
        ToastAndroid.show("book is officialy issued", ToastAndroid.LONG);
      }
    } else {
      var isStudentEligible =
        await this.checkStudentEligibilityForBookReturned();
      if (isStudentEligible) {
        this.initiateBookReturn();
        ToastAndroid.show("book is officialy returned", ToastAndroid.LONG);
      }
    }
  };
  render() {
    if (this.state.buttonState !== "normal" && this.state.hasCameraPermission) {
      return (
        <BarCodeScanner
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={
            this.state.scanned ? undefined : this.handleBarCodeScanner
          }
        />
      );
    } else if (this.state.buttonState === "normal") {
      return (
        <KeyboardAvoidingView
          behavior="padding"
          enabled
          style={styles.container}
        >
          <Image
            style={{ width: "20%", height: "20%", alignSelf: "center" }}
            source={require("../assets/booklogo.jpg")}
          />
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(text) => {
                this.setState({ scannedBookID: text });
              }}
              style={styles.textInput}
              placeholder="bookID"
              value={this.state.scannedBookID}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.getCameraPermissions("bookID");
              }}
            >
              <Text>scan</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TextInput
              onChangeText={(text2) => {
                this.setState({ scannedStudentID: text2 });
              }}
              style={styles.textInput}
              placeholder="studentID"
              value={this.state.scannedStudentID}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.getCameraPermissions("studentID");
              }}
            >
              <Text>scan</Text>
            </TouchableOpacity>
          </View>
          <Text>
            {this.state.hasCameraPermission == true
              ? this.state.scannedData
              : "requestCameraPosition"}
          </Text>
          <Text>TransactionScreen</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.handleTransactions();
            }}
          >
            <Text>submit</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 100,
  },
  textInput: {
    borderWidth: 0.5,
    padding: 10,
    fontSize: 15,
    width: "50%",
    marginTop: 10,
    marginRight: 5,
    //fontFamily:
  },
  button: {
    backgroundColor: "yellow",
    borderRadius: 5,
    padding: 10,
    width: "20%",
    marginTop: 10,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});

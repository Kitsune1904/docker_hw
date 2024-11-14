import {connect} from "mongoose";
import {MONGO} from "../constants";


const connectToDB = async () => {
    console.log(MONGO)
    try {
        await connect(MONGO, {
            autoIndex: true
        })
        console.log('Connected to Mongodb Atlas');}
    catch (error) {
        console.error(error);
    }
}



export default connectToDB
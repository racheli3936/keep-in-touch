import { jwtDecode, JwtPayload } from 'jwt-decode';
import Swal from 'sweetalert2'
import { EmailRequest } from '../types/types';
import axios from 'axios';
export const successAlert = (message: string,time:number=1100) => {
    return new Promise((resolve) => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer:time
        }).then(() => {
            resolve(true); // Resolve the promise when the alert is closed
        });
    });
}
export const errorAlert = (message: string) => {
    return new Promise((resolve) => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message
        }).then(() => {
            resolve(true); // Resolve the promise when the alert is closed
        });
    });
}
interface CustomJwtPayload extends JwtPayload {
    unique_name?: string;
}
export const extractIdFromToken=(token:string)=>{
        const decodedToken= jwtDecode<CustomJwtPayload>(token);
        const userId = decodedToken.unique_name;
        console.log('token',token)
        console.log('User ID:', userId);
    return userId
}
export const sendEmail = async (emailData:EmailRequest) => {
    try {
        const response = await axios.post('https://localhost:7191/api/Mail/api/send-email', emailData);
        console.log(response,"**mail");
        return response
        
    } catch (error:any) {
        if (error.response) {
            console.log(error);
            errorAlert("כתובת המייל או נתונים אחרים לא תקינים")
            
        } else {
            console.log("error2")
            // Something happened in setting up the request that triggered an Error
           
        }
    }
}
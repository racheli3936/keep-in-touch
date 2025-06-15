import { jwtDecode, JwtPayload } from 'jwt-decode';
import Swal from 'sweetalert2'
import { EmailRequest } from '../types/types';
import axios from 'axios';
import UserStore from '../stores/UserStore';
export const successAlert = (message: string,time:number=1100) => {
    return new Promise((resolve) => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer:time
        }).then(() => {
            resolve(true); 
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
            resolve(true); 
        });
    });
}
interface CustomJwtPayload extends JwtPayload {
    unique_name?: string;
}
export const extractIdFromToken=(token:string)=>{
        const decodedToken= jwtDecode<CustomJwtPayload>(token);
        const userId = decodedToken.unique_name;
    return userId
}
export const sendEmail = async (emailData:EmailRequest) => {
    try {
        const response = await axios.post('https://keepintouch.onrender.com/api/Mail/api/send-email', emailData);
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
export const getUserById=(id:number)=>
{
   return UserStore.Userslist.find(user => user.id === id);
}
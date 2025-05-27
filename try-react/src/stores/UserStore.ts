import axios from "axios"
import { makeAutoObservable } from "mobx"
import { User } from "../types/types"

class UserStore {
   currentUser!:User
    Userslist: User[] = []
    constructor() {
        makeAutoObservable(this)
    }
   
    async addUser(_user: Partial<User>) {
        // try {
        //     const res = await axios.post('',
        //         {
        //               Name: user.Name,
        //               Phone: user.Phone,
        //               Email: user.Email,
        //               Address: user.Address,
        //               PreviousFamily: user.PreviousFamily,
        //               Files: [],
        //               UserGroups: []
        //         },
        //          {
        //         headers: {
                   
        //         }
        //     });
        // } catch (error) {

        //     console.error('Error fetching data:', error);
        // }
    }
    async getAllUsers() {
        // try {

        //     const res = await axios.get('');
        //     this.list = res.data

        // }
        // catch (error:any) {
        //     alert("i catch get")
        //     if (error.status === 401) {
        //         alert("email or passward isnt valid")
        //     }
        //     console.error('Error fetching recipes:', error)
        // }
    }
    async getUsersForGroup(id: string) {
         const token = localStorage.getItem('token'); // Retrieve token from local storage
                    try {
                        const response = await axios.get(`https://keepintouch.onrender.com/api/User/group/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        this.Userslist=response.data;
                        console.log("users for group",this.Userslist)
                        console.log('res',response.data);
                        
                    } catch (error: any) {
                        (error.response ? error.response.data : error.message);
                    }
    }
}
export default new UserStore()
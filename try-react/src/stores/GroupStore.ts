import axios from "axios"
import { makeAutoObservable } from "mobx"
import { Group } from "../types/types"

class GroupStore {
    currentGroup!: Group
    Groupslist: Group[] = []
    constructor() {
        makeAutoObservable(this)
        //this.getAllGroups()
    }
    async setCurrentGroup(group:Group)
    {
        this.currentGroup=group
    }
    async addGroup(_group: Partial<Group>) {
        // try {
        //     const res = await axios.post('',
        //         {
        //         },
        //         {
        //             headers: {

        //             }
        //         });
        // } catch (error) {

        //     console.error('Error fetching data:', error);
        // }
    }
    async getAllGroups() {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
            try {
                const response = await axios.get('https://keepintouch.onrender.com/api/Group/user/groups', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.Groupslist=response.data               
            } catch (error: any) {
                console.log(error.response ? error.response.data : error.message);
            }
    }
}
export default new GroupStore()
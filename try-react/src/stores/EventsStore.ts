import axios from "axios"
import { makeAutoObservable } from "mobx"
import { MyFile } from "../types/types"
import GroupStore from "./GroupStore"

class EventsStore {
    Eventlist: MyFile[] = []
   urlList: string[] = []
   currentEventAdd: MyFile | null = null
    constructor() {
        makeAutoObservable(this)
    }
    async addEvent(data: Partial<MyFile>) {
        console.log(data, "data in addEvent");
        
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('https://keepintouch.onrender.com/api/File', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            this.currentEventAdd=response.data

            console.log(this.currentEventAdd,"currentEventAdd");
            
            this.Eventlist.push(response.data); 
            this.urlList.push(response.data.filePath);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    async getEvevntByGroupId(groupId:number=GroupStore.currentGroup.id) {
        const token = localStorage.getItem('token'); 
        try {
            const response = await axios.get(`https://keepintouch.onrender.com/api/File/group/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            this.Eventlist=response.data
          this.urlList = this.Eventlist.map(file => file.filePath); 
          
        } catch (error: any) {
            console.log(error.response ? error.response.data : error.message);
        }
    }
}
export default new EventsStore()
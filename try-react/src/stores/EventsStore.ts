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
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('https://keepintouch.onrender.com/api/File', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    //'Content-Type': 'multipart/form-data' // חשוב לציין את סוג התוכן
                }
            });
            console.log(response.data, "response.data eventssssssssss");
            this.currentEventAdd=response.data
            this.Eventlist.push(response.data); // הוספת ההודעה שנוספה
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
    async getEvevntByGroupId(groupId:number=GroupStore.currentGroup.id) {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        try {
            const response = await axios.get(`https://keepintouch.onrender.com/api/File/group/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            this.Eventlist=response.data
          // this.urlList=response.data
          this.urlList = this.Eventlist.map(file => file.filePath); 
          console.log(response.data, "response.data eventssssssssss11");
          console.log(this.urlList, "this.urlList eventssssssssss22");
          
        } catch (error: any) {
            console.log(error.response ? error.response.data : error.message);
        }
    }
}
export default new EventsStore()
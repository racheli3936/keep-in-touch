import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { Massage } from '../types/types';
import GroupStore from './GroupStore';

class MessageStore {
    groupMessages:Massage[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    fetchMessages = async () => {
        try {
            const response = await axios.get(`https://keepintouch.onrender.com/api/Massage/${GroupStore.currentGroup.id}/massages`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            this.groupMessages = response.data;
            console.log(response.data,"response.data");
             // עדכון המידע בחנות
        } catch (error:any) {
            if (error.response.status === 404) {
                console.log("there is no massages ");
            }
            else{
      
            console.error("Error fetching messages:", error);
            }
            this.groupMessages = [{content:"אין הודעות בקבוצה",fontSize:'20px',id:-1,userId:-1,groupId:-1,createdDate:new Date(),color:'black'}]; // אם יש שגיאה, נוודא שהחנות לא ריקה
        }
    };
    addMessage = async (message:Partial<Massage>) => {
        try {
            const response = await axios.post('https://keepintouch.onrender.com/api/Massage', message, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data,"response.data");
            
            this.groupMessages.push(response.data); // הוספת ההודעה שנוספה
        } catch (error) {
          
                console.error("Error adding message:", error);
        }
    };
    deleteMessage = async (messageId: number) => {
        try {
            await axios.delete(`https://keepintouch.onrender.com/api/Massage/${GroupStore.currentGroup.id}/${messageId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // אם המחיקה הצליחה, הסר את ההודעה מהחנות
            this.groupMessages = this.groupMessages.filter(message => message.id !== messageId);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };
    
}
const messageStore = new MessageStore();
export default messageStore;

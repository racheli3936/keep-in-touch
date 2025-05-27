import { makeAutoObservable } from "mobx"

class FileStore {
  
    constructor() {
        makeAutoObservable(this)
    }
   
    
}
export default new FileStore()
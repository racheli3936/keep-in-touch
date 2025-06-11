import { createContext} from "react"

export type Group = {
    adminId: number
    id:number,
    name: string,
    password:string,
    groupMembers: GroupUser[] }

export enum EUserRole {
    Admin,
    User
}
export type User ={
   id: number,
    name: string,
    phone: string,
    email: string,
    address: string,
    previousFamily: string,
    files: File[],
    userGroups: GroupUser[]}
    
export enum ECategory {
    wedding="wedding",
    bar_mitzva="bar_mitzva",
    brit="brit",
    party="party",
    other="other"
}
export const categoryNames: { [key in ECategory]: string } = {
    [ECategory.wedding]: 'חתונה',
    [ECategory.bar_mitzva]: 'בר מצווה',
    [ECategory.brit]: 'ברית',
    [ECategory.party]: 'מסיבה',
    [ECategory.other]: 'אחר'
};

export type MyFile = {
    
    id: number,
    userId: number,
    groupId:number,
    fileName: string,
    filePath: string,
    fileSize: number,
    category: ECategory,
    description: string,
    eventDate: Date,
    content: string,
    fileType: string
}
export type GroupUser = {
    Id: number,
    GroupId: number,
    UserId: number,
    Role: EUserRole,
}
export type EmailRequest=
{
    to:string,
    subject: string,
    body: string
}
export type Massage=
{
    id: number,
    userId: number,
    groupId: number,
    content: string,
    fontSize: string,
    color: string,
    createdDate: Date,
}
export type UserContextType ={
    user: User|null;
    setUser: (user: User) => void;
}
export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {}, // פונקציה ריקה כברירת מחדל
});
export type EventsCalender = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  imageUrl: string;
  originalDate: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
    extendedProps?: {
    imageUrl?: string;
    category?: string | number;
  };

};

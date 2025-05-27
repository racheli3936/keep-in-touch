import { createBrowserRouter } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import AppLayout from "./components/appLayout";
import Dashboard from "./components/dashboard";
import ShowGroup from "./components/showGroup";
import OpenNewGroup from "./components/openNewGroup";
import HomePage from "./components/homePage";
import GroupMembers from "./components/groupMembers";
import Events from "./components/events";
import ManageUsersInGroup from "./components/manageUsersInGroup";
import EmailSender from "./components/emailSender";
import Massages from "./components/massages";
import Update from "./components/update";
import CalendarEvent from "./components/calenderEvent";
import Chat from "./components/chat";
import ShowEvents from "./components/showEvents";
import FileUploader from "./components/fileUploader";
import Materials from "./components/materials";
import Home from "./components/home";
import ShowDocuments from "./components/showDocuments";
import DocumentUploader from "./components/documentUploader";
const Router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <>Main error</>,
        children: [
            {
                path: 'login',
                element: <Login setIsConnected={function (): void {
                    throw new Error("Function not implemented.");
                }} showSnackbar={function (_message: string): void {
                    throw new Error("Function not implemented.");
                }} />
            },
            {
                path: 'register',
                element: <Register setIsConnected={function (): void {
                    throw new Error("Function not implemented.");
                }} showSnackbar={function (_message: string): void {
                    throw new Error("Function not implemented.");
                }} />,
            },
            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
                children: [
                    {
                        path: 'openNewGroup',
                        element: <OpenNewGroup />,
                    },
                    {
                        path: 'notifications',
                        //   element: <Notifications />,
                    },
                ],
            },
            {
                path: 'showGroup/:name/:id',
                element: <ShowGroup />,
                children: [
                    {
                        path: 'groupMembers',
                        element: <GroupMembers />,
                        children: [
                            {
                                path: 'sendEmail',
                                element: <EmailSender to={""} isOpen={false} onClose={undefined} />
                            }
                        ]
                    },
                    {
                        path: 'events',
                        element: <Events />,
                        children: [
                            {

                                path: 'fileUploader',
                                element: <FileUploader open={false} onClose={function (): void {
                                    throw new Error("Function not implemented.");
                                }} />
                            },
                            {
                                // path: 'showEvents',
                                index: true,
                                element: <ShowEvents />
                            }
                        ]
                    },
                    {
                        path: 'manageUsers',
                        element: <ManageUsersInGroup />
                    },
                    {
                        path: 'massages',
                        element: <Massages />
                    },
                    {
                        path: 'calender',
                        element: <CalendarEvent />
                    },
                    {
                        path: 'chat',
                        element: <Chat/>
                    },
                    {
                        path: 'materials',
                        element: <Materials />,
                         children:[ 
                            {
                                path: 'documentUploader',
                                element: <DocumentUploader open={false} onClose={function (): void {
                                    throw new Error("Function not implemented.");
                                }} />
                            },
                            {
                                // path: 'showEvents',
                                index: true,
                                element: <ShowDocuments />
                            }

                        ]
                    }
                ]
            },
            {
                path: 'homePage',
                element: <HomePage />
            },
            {
                path: 'update',
                element: <Update />
            },
            {
                path: '*', // Catch-all route for 404
                //  element: <NotFound />,
            },

        ],
    },
]);
export default Router;
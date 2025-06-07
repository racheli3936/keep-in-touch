import { useContext, useEffect, useState } from "react";
import { FileText, Users, Upload, MessageSquare, Search, AlertCircle, Settings, Plus } from "lucide-react";
import "./homeStyle.css";
import { Group, Massage, MyFile, UserContext } from "../types/types";
import { observer } from "mobx-react-lite";
import MassageStore from "../stores/MassageStore";
import EventsStore from "../stores/EventsStore";
import GroupStore from "../stores/GroupStore";
import UserStore from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
interface MembersCount {
  [key: string]: number; // מפתחות מסוג string עם ערכים מסוג number
}

const Home = observer(() => {

  const [notifications, setNotifications] = useState<Massage[]>([]);
  const [recentFiles, setRecentFiles] = useState<MyFile[]>([]);
  const [activeGroups, setActiveGroups] = useState<Group[]>([]);
  const context = useContext(UserContext);
  const [hoveredFile, setHoveredFile] = useState<number | null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const navigate=useNavigate();
    const [storageUsage, setStorageUsage] = useState<number>(0);
const [membersCount, setMembersCount] = useState<MembersCount>({});
  useEffect(() => {
    const fetchAllMembersCount = async () => {
      const counts:MembersCount = {};
      for (const group of activeGroups) {
        counts[group.id] = await getCountMembers(group.id.toString());
      }
      setMembersCount(counts);
    };

    fetchAllMembersCount();
  }, [activeGroups]);
   useEffect(() => {
    const totalSize = recentFiles.reduce((accumulator, file) => {
      console.log(`File: ${file.fileName}, Size: ${file.fileSize}`);
      return accumulator + file.fileSize;
    }, 0) / (1024 * 1024);
    
    setStorageUsage(totalSize);
  }, [recentFiles]);
  useEffect(() => {
    const loadNotifications = async () => {
      await MassageStore.fetchMessages();
      setNotifications(MassageStore.groupMessages);
    };

    const loadRecentFiles = async () => {
      await EventsStore.getEvevntByGroupId();
      setRecentFiles(EventsStore.Eventlist);
    };

    const loadActiveGroups = async () => {
      await GroupStore.getAllGroups();
      setActiveGroups(GroupStore.Groupslist);
    };

    loadNotifications();
    loadRecentFiles();
    loadActiveGroups();
  }, []);
  const getUserName = (userId: number) => {
    return UserStore.Userslist.find(user => user.id === userId)?.name || userId;
  }
  const getCountMembers = async (groupId: string) => {
 await UserStore.getUsersForGroup(groupId);
 return UserStore.Userslist.length;
  }
  const navigateDashboard = () => {
    navigate("/dashboard");
  }
  return (
    <div className="container">
      {/* Main Content */}
      <main className="main">
        <div className="main-content">
          {/* Main Content Column */}
          <div className="main-column">
            {/* Welcome Section */}
            <div className="card">
              <h2 className="section-title">ברוך הבא, {context.user?.name}!</h2>
              <p className="welcome-text">
                מה תרצה לעשות היום? שתף קבצים, שלח הודעות או צור קבוצות חדשות.
              </p>
              <div className="action-buttons">
                <button className="action-button upload-button">
                  {typeof Upload === 'function' ? <Upload className="blue-icon" size={24} /> : "⬆️"}
                  <span className="upload-button-text">העלאת קובץ</span>
                </button>
                <button className="action-button message-button">
                  {typeof MessageSquare === 'function' ? <MessageSquare className="green-icon" size={24} /> : "💬"}
                  <span className="message-button-text">הודעה חדשה</span>
                </button>
                <button className="action-button users-button">
                  {typeof Users === 'function' ? <Users className="purple-icon" size={24} /> : "👥"}
                  <span className="users-button-text">קבוצה חדשה</span>
                </button>
              </div>
            </div>

            {/* Recent Files */}
            <div className="card">
              <div className="file-header">
                <button className="view-all-button">
                  <span>הכל</span>
                </button>
                <h2 className="section-subtitle">קבצים אחרונים</h2>
              </div>
              <div className="file-list">
                {recentFiles.slice(-3).map(file => (
                  <div
                    key={file.id}
                    className={`file-item ${hoveredFile === file.id ? 'file-item-hover' : ''}`}
                    onMouseEnter={() => setHoveredFile(file.id)}
                    onMouseLeave={() => setHoveredFile(null)}
                  >
                    <div className="file-date">
                      {file.category}
                    </div>
                    <div className="file-info">
                      <div>
                        <div className="file-name">{file.fileName}</div>
                        <div className="file-shared-by">שותף ע"י {getUserName(file.userId)}</div>
                      </div>
                      <div className="file-icon">
                        {typeof FileText === 'function' ? <FileText size={20} /> : "📄"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="add-file-button" onClick={navigateDashboard}>
                {typeof Plus === 'function' ? <Plus size={16} className="icon-margin-left" /> : "+"}
                <span>העלאת קובץ חדש</span>
              </button>
            </div>

            {/* What's New / Tips */}
            <div className="whats-new-card">
              <div className="whats-new-header">
                <button className="settings-button">
                  {typeof Settings === 'function' ? <Settings size={18} /> : "⚙️"}
                </button>
                <h2 className="whats-new-title">
                  {typeof AlertCircle === 'function' ? <AlertCircle size={18} className="icon-margin-left" /> : "ℹ️"}
                  מה חדש במערכת?
                </h2>
              </div>
              <ul className="whats-new-list">
                <li className="whats-new-item">
                  <span>כעת ניתן לשתף קבצים עם מספר קבוצות במקביל</span>
                  <span className="whats-new-dot"></span>
                </li>
                <li className="whats-new-item">
                  <span>תמיכה בתצוגה מקדימה של קבצי Word ו-PDF</span>
                  <span className="whats-new-dot"></span>
                </li>
                <li className="whats-new-item">
                  <span>הגדלנו את נפח האחסון ל-10GB לכל משתמש</span>
                  <span className="whats-new-dot"></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Search */}
            <div className="search-container">
              <input
                type="text"
                placeholder="חיפוש קבצים, הודעות, אנשים..."
                className="search-input"
              />
              <div className="search-icon">
                {typeof Search === 'function' ? <Search size={20} /> : "🔍"}
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <h2 className="section-subtitle">התראות אחרונות</h2>
              <div className="notification-list">
                {notifications.slice(-4).map(notification => (
                  <div key={notification.id} className="notification-item">
                    <p className="notification-text">{notification.content}</p>
                    <p className="notification-time">{notification.createdDate.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Groups */}
            <div className="card">
              <h2 className="section-subtitle">הקבוצות שלי</h2>
              <div className="groups-list">
                {activeGroups.map(group => (
                  <div
                    key={group.id}
                    className={`group-item ${hoveredGroup == group.id ? 'group-item-hover' : ''}`}
                    onMouseEnter={() => setHoveredGroup(group.id)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <div className="group-info">
                      {/* {group.unread > 0 && (
                        <span className="unread-badge">
                          {group.unread}
                        </span>
                      )} */}

                      <span className="members-count">   {membersCount[group.id] || 0} חברים</span>
                    </div>
                    <span className="group-name">{group.name}</span>
                  </div>
                ))}
                <button className="add-group-button" onClick={navigateDashboard}>
                  {typeof Plus === 'function' ? <Plus size={16} className="icon-margin-left" /> : "+"}
                  <span>הוספת קבוצה חדשה</span>
                </button>
              </div>
            </div>

            {/* Storage Status */}
            <div className="storage-status">
              <div className="storage-header">
                <span className="storage-usage"> {storageUsage.toFixed(2)} MB</span>
                <h3 className="storage-title">שטח אחסון</h3>
              </div>
              <div className="storage-bar">
                <div className="storage-bar-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          ShareSpace © 2025 | <a href="#" className="footer-link">תנאי שימוש</a> | <a href="#" className="footer-link">פרטיות</a> | <a href="#" className="footer-link">עזרה</a>
        </div>
      </footer>
    </div>
  );
});

export default Home
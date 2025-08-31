import '../styles/Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            <a href="#graphview" className="sidebar-item">Graph View</a>
            <a href="#tableview" className="sidebar-item">Table View</a>
        </div>
    );
}

export default Sidebar;
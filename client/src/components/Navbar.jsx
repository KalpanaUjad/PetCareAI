
import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h3>Pet Owner Portal</h3>
        <p>Take care of your furry friends</p>
      </div>

      <div className="navbar-right">
        <Bell size={21} />
        <div className="user-info">
          <UserCircle size={28} />
          <span>Pet Owner</span>
        </div>
      </div>
    </header>
  );
}

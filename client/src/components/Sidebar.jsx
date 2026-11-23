
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  CalendarDays,
  Pill,
  ClipboardList,
  Bot
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "My Pets", path: "/pets", icon: PawPrint },
  { name: "Appointments", path: "/appointments", icon: CalendarDays },
  { name: "Prescriptions", path: "/prescriptions", icon: Pill },
  { name: "Medical History", path: "/history", icon: ClipboardList },
  { name: "AI Assistant", path: "/ai", icon: Bot }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">🐾 PetCare AI</h2>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

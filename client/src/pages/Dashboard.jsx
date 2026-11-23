
import { useEffect, useState } from "react";
import {
  PawPrint,
  CalendarDays,
  Pill,
  ClipboardList
} from "lucide-react";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    pets: 0,
    appointments: 0,
    prescriptions: 0,
    medicalHistory: 0
  });

  useEffect(() => {
    const updateCounts = () => {
      setCounts({
        pets: JSON.parse(localStorage.getItem("pets") || "[]").length,
        appointments: JSON.parse(localStorage.getItem("appointments") || "[]").length,
        prescriptions: JSON.parse(localStorage.getItem("prescriptions") || "[]").length,
        medicalHistory: JSON.parse(localStorage.getItem("medicalHistory") || "[]").length
      });
    };

    updateCounts();
    window.addEventListener("storage", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  const cards = [
    {
      title: "My Pets",
      value: counts.pets,
      icon: PawPrint
    },
    {
      title: "Appointments",
      value: counts.appointments,
      icon: CalendarDays
    },
    {
      title: "Prescriptions",
      value: counts.prescriptions,
      icon: Pill
    },
    {
      title: "Medical Records",
      value: counts.medicalHistory,
      icon: ClipboardList
    }
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your pet care overview.</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.title}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div>
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState(() =>
    JSON.parse(localStorage.getItem("appointments") || "[]")
  );

  const pets = JSON.parse(localStorage.getItem("pets") || "[]");

  const [form, setForm] = useState({
    pet: "",
    date: "",
    reason: ""
  });

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const bookAppointment = (e) => {
    e.preventDefault();

    if (!form.pet) return;

    setAppointments([
      ...appointments,
      { ...form, id: Date.now(), status: "Pending" }
    ]);

    setForm({ pet: "", date: "", reason: "" });
  };

  return (
    <div className="page">
      <h1>Appointments</h1>
      <p>Schedule veterinary appointments for your pets.</p>

      <form className="form-card" onSubmit={bookAppointment}>
        <h3>Book Appointment</h3>

        <select
          value={form.pet}
          onChange={(e) => setForm({ ...form, pet: e.target.value })}
          required
        >
          <option value="">Select Pet</option>
          {pets.map((pet) => (
            <option key={pet.id} value={pet.name}>{pet.name}</option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />

        <textarea
          placeholder="Reason for appointment"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          required
        />

        <button type="submit">Book Appointment</button>
      </form>

      <h2>Appointment History</h2>

      {appointments.map((item) => (
        <div className="record-card" key={item.id}>
          <h3>{item.pet}</h3>
          <p>{item.reason}</p>
          <p>{item.date}</p>
          <span className="status">{item.status}</span>
        </div>
      ))}

      {appointments.length === 0 && <p>No appointments booked yet.</p>}
    </div>
  );
}

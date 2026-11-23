
import { useEffect, useState } from "react";
import { ClipboardList, Trash2 } from "lucide-react";

export default function MedicalHistory() {
  const [records, setRecords] = useState(() =>
    JSON.parse(localStorage.getItem("medicalHistory") || "[]")
  );

  const pets = JSON.parse(localStorage.getItem("pets") || "[]");

  const [form, setForm] = useState({
    pet: "",
    diagnosis: "",
    treatment: ""
  });

  useEffect(() => {
    localStorage.setItem("medicalHistory", JSON.stringify(records));
  }, [records]);

  const addRecord = (e) => {
    e.preventDefault();

    setRecords([
      ...records,
      {
        ...form,
        id: Date.now(),
        date: new Date().toLocaleDateString()
      }
    ]);

    setForm({ pet: "", diagnosis: "", treatment: "" });
  };

  return (
    <div className="page">
      <h1>Medical History</h1>
      <p>Keep track of your pets' medical records.</p>

      <form className="form-card" onSubmit={addRecord}>
        <h3>Add Medical Record</h3>

        <select
          value={form.pet}
          onChange={(e) => setForm({ ...form, pet: e.target.value })}
          required
        >
          <option value="">Select Pet</option>
          {pets.map(p => <option key={p.id}>{p.name}</option>)}
        </select>

        <input
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
          required
        />

        <textarea
          placeholder="Treatment details"
          value={form.treatment}
          onChange={(e) => setForm({ ...form, treatment: e.target.value })}
        />

        <button type="submit">Save Record</button>
      </form>

      {records.map(record => (
        <div className="record-card" key={record.id}>
          <ClipboardList size={25} />
          <h3>{record.pet}</h3>
          <p>Diagnosis: {record.diagnosis}</p>
          <p>Treatment: {record.treatment}</p>
          <small>{record.date}</small>

          <button
            className="delete-btn"
            onClick={() => setRecords(records.filter(r => r.id !== record.id))}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      ))}

      {records.length === 0 && <p>No medical records available.</p>}
    </div>
  );
}

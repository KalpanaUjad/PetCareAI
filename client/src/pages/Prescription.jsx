
import { useEffect, useState } from "react";
import { Pill, Trash2 } from "lucide-react";

export default function Prescriptions() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("prescriptions") || "[]")
  );

  const pets = JSON.parse(localStorage.getItem("pets") || "[]");

  const [form, setForm] = useState({
    pet: "",
    medicine: "",
    dosage: "",
    instructions: ""
  });

  useEffect(() => {
    localStorage.setItem("prescriptions", JSON.stringify(items));
  }, [items]);

  const addPrescription = (e) => {
    e.preventDefault();

    setItems([
      ...items,
      { ...form, id: Date.now(), date: new Date().toLocaleDateString() }
    ]);

    setForm({ pet: "", medicine: "", dosage: "", instructions: "" });
  };

  return (
    <div className="page">
      <h1>Prescriptions</h1>
      <p>Manage your pets' prescribed medicines.</p>

      <form className="form-card" onSubmit={addPrescription}>
        <h3>Add Prescription</h3>

        <select
          value={form.pet}
          onChange={(e) => setForm({ ...form, pet: e.target.value })}
          required
        >
          <option value="">Select Pet</option>
          {pets.map(p => <option key={p.id}>{p.name}</option>)}
        </select>

        <input
          placeholder="Medicine Name"
          value={form.medicine}
          onChange={(e) => setForm({ ...form, medicine: e.target.value })}
          required
        />

        <input
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        />

        <textarea
          placeholder="Instructions"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })}
        />

        <button type="submit">Add Prescription</button>
      </form>

      <div className="record-grid">
        {items.map(item => (
          <div className="record-card" key={item.id}>
            <Pill size={25} />
            <h3>{item.medicine}</h3>
            <p>Pet: {item.pet}</p>
            <p>Dosage: {item.dosage}</p>
            <p>{item.instructions}</p>
            <small>{item.date}</small>

            <button
              className="delete-btn"
              onClick={() => setItems(items.filter(i => i.id !== item.id))}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && <p>No prescriptions available.</p>}
    </div>
  );
}

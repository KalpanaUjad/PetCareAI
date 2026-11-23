
import { useEffect, useState } from "react";
import { PawPrint, Trash2 } from "lucide-react";

export default function Pets() {
  const [pets, setPets] = useState(() =>
    JSON.parse(localStorage.getItem("pets") || "[]")
  );

  const [form, setForm] = useState({
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    gender: "Male"
  });

  useEffect(() => {
    localStorage.setItem("pets", JSON.stringify(pets));
  }, [pets]);

  const addPet = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    setPets([...pets, { ...form, id: Date.now() }]);

    setForm({
      name: "",
      type: "Dog",
      breed: "",
      age: "",
      gender: "Male"
    });
  };

  const deletePet = (id) => {
    setPets(pets.filter((pet) => pet.id !== id));
  };

  return (
    <div className="page">
      <h1>My Pets 🐾</h1>
      <p>Manage your registered pets.</p>

      <form className="form-card" onSubmit={addPet}>
        <h3>Add New Pet</h3>

        <input
          placeholder="Pet Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Dog</option>
          <option>Cat</option>
          <option>Bird</option>
          <option>Rabbit</option>
          <option>Other</option>
        </select>

        <input
          placeholder="Breed"
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
        />

        <input
          type="number"
          placeholder="Age in years"
          min="0"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option>Male</option>
          <option>Female</option>
        </select>

        <button type="submit">Add Pet</button>
      </form>

      <div className="pet-grid">
        {pets.map((pet) => (
          <div className="pet-card" key={pet.id}>
            <PawPrint size={32} />
            <h3>{pet.name}</h3>
            <p>{pet.type} · {pet.breed || "Breed not specified"}</p>
            <p>Age: {pet.age || "Not specified"}</p>
            <p>Gender: {pet.gender}</p>

            <button className="delete-btn" onClick={() => deletePet(pet.id)}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        ))}
      </div>

      {pets.length === 0 && <p>No pets added yet.</p>}
    </div>
  );
}

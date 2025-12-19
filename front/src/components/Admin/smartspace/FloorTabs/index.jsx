import React, { useState } from "react";
import PropTypes from "prop-types";

export default function FloorTabs({ floors, selected, onSelect, onAdd, onRename, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [tmpName, setTmpName] = useState("");

  const startEdit = (f) => {
    setEditingId(f.id);
    setTmpName(f.name);
  };

  const saveEdit = () => {
    if (tmpName.trim()) onRename(editingId, tmpName.trim());
    setEditingId(null);
  };

  const handleDelete = (f, e) => {
    e.stopPropagation();
    onDelete(f.id);
  };

  return (
    <div className="flex items-center gap-3">
      <nav className="flex items-center gap-2 p-1 rounded-full">
        {floors.map((f) => (
          <div key={f.id} className="relative">
            {editingId === f.id ? (
              <div className="flex items-center gap-1">
                <input
                  value={tmpName}
                  onChange={(e) => setTmpName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                  className="px-3 py-1 rounded-md bg-slate-700 text-sm text-white outline-none"
                />
                <button onClick={saveEdit} className="ml-1 px-2 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="ml-1 px-2 py-1 rounded-md bg-slate-600 hover:bg-slate-500 text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelect(f.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition ${
                  f.id === selected
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-900 shadow"
                    : "text-slate-300 hover:bg-slate-700/40"
                }`}
              >
                <span>{f.name}</span>
                <span onClick={(e) => { e.stopPropagation(); startEdit(f); }} className="ml-1 text-xs text-slate-400 hover:text-slate-100 cursor-pointer">✏️</span>
                {floors.length > 1 && (
                  <span onClick={(e) => handleDelete(f, e)} className="ml-1 text-xs text-slate-400 hover:text-red-400 cursor-pointer">🗑️</span>
                )}
              </button>
            )}
          </div>
        ))}

        <button
          onClick={onAdd}
          className="ml-1 h-10 w-10 rounded-full bg-gradient-to-br from-slate-700/80 to-slate-600/60 flex items-center justify-center text-white hover:scale-105 transition"
          title="Shto Kat"
        >
          +
        </button>
      </nav>
    </div>
  );
}

FloorTabs.propTypes = {
  floors: PropTypes.array.isRequired,
  selected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

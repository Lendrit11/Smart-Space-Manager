import React from "react";
import PropTypes from "prop-types";

export default function FloorTabs({ floors, selected, onSelect, onAdd, onDelete }) {
  const handleDelete = (f, e) => {
    e.stopPropagation();
    onDelete(f.id);
  };

  return (
    <div className="flex items-center gap-3">
      <nav className="flex items-center gap-2 p-1 rounded-full">
        {floors.map((f) => (
          <div key={f.id} className="relative">
            <button
              onClick={() => onSelect(f.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition ${
                f.id === selected
                  ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-900 shadow"
                  : "text-slate-300 hover:bg-slate-700/40"
              }`}
            >
              <span>{f.name}</span>

              {floors.length > 1 && (
                <span
                  onClick={(e) => handleDelete(f, e)}
                  className="ml-1 text-xs text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  🗑️
                </span>
              )}
            </button>
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
  onDelete: PropTypes.func.isRequired,
};

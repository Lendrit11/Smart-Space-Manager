import React from "react";
import PropTypes from "prop-types";

export default function FloorTabs({ floors, selected, onSelect }) {
  return (
    <div className="flex items-center gap-3">
      <nav className="flex items-center gap-2 bg-slate-800/40 p-1 rounded-full">
        {floors.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition ${
              f.id === selected
                ? "bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-900 shadow"
                : "text-slate-300 hover:bg-slate-700/40"
            }`}
            aria-pressed={f.id === selected}
          >
            <span>{f.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

FloorTabs.propTypes = {
  floors: PropTypes.array.isRequired,
  selected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

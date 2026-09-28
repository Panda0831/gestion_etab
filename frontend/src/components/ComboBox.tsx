import { useState, useRef, useEffect, useMemo } from "react";

// "Terminale" == "terminale" == "Términale"
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

interface ComboboxProps<T> {
  label: string;
  placeholder?: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getKey: (o: T) => string;
  getLabel: (o: T) => string;
  getHint?: (o: T) => string; // affiché sous le label (ex. année scolaire)
}

export default function Combobox<T>({
  label, placeholder, options, value, onChange, getKey, getLabel, getHint,
}: ComboboxProps<T>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Clic à l'extérieur : on ferme et on restaure le texte de la sélection
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value ? getLabel(value) : "");
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [value, getLabel]);

  const filtered = useMemo(() => {
    const q = value ? "" : norm(query.trim()); // valeur choisie : on remontre toute la liste
    if (!q) return options;
    return options.filter((o) => norm(`${getLabel(o)} ${getHint?.(o) ?? ""}`).includes(q));
  }, [options, query, value, getLabel, getHint]);

  const select = (o: T) => {
    onChange(o);
    setQuery(getLabel(o));
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && filtered[active]) {
      e.preventDefault(); // évite de soumettre le formulaire
      select(filtered[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="combo" ref={ref}>
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onFocus={(e) => {
          setOpen(true);
          e.target.select();
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onChange(null); // le texte a changé : la sélection n'est plus valide
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
      />

      {open && (
        <ul className="combo-list" role="listbox">
          {filtered.length === 0 ? (
            <li className="combo-empty">Aucun résultat</li>
          ) : (
            filtered.map((o, i) => (
              <li
                key={getKey(o)}
                role="option"
                aria-selected={value ? getKey(value) === getKey(o) : false}
                className={`combo-item ${i === active ? "active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // garde le focus, sinon le blur ferme la liste avant le clic
                  select(o);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span>{getLabel(o)}</span>
                {getHint && <small>{getHint(o)}</small>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
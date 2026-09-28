import { useRef, useState, DragEvent } from "react";

const MAX_FILES = 5;
const MAX_SIZE = 100 * 1024 * 1024;

const isAllowed = (f: File) => /^(image|video|audio)\//.test(f.type) || f.type === "application/pdf";
const icon = (f: File) =>
  f.type.startsWith("video/") ? "🎬" : f.type.startsWith("audio/") ? "🎵" : f.type.startsWith("image/") ? "🖼️" : "📄";
const size = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} Mo` : `${Math.ceil(n / 1024)} Ko`);

interface FilePickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function FilePicker({ files, onChange, disabled }: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = (incoming: FileList | File[]) => {
    const rejected: string[] = [];
    const accepted = [...incoming].filter((f) => {
      if (!isAllowed(f)) return rejected.push(`${f.name} (format non supporté)`), false;
      if (f.size > MAX_SIZE) return rejected.push(`${f.name} (plus de 100 Mo)`), false;
      return true;
    });
    const merged = [...files, ...accepted];
    if (merged.length > MAX_FILES) rejected.push(`${MAX_FILES} fichiers maximum`);
    onChange(merged.slice(0, MAX_FILES));
    setError(rejected.length ? `Ignoré : ${rejected.join(", ")}` : null);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (!disabled) add(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="form-label">Fichiers (facultatif)</label>

      <div
        className={`file-drop ${drag ? "drag" : ""}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
      >
        <p>
          Glissez vos fichiers ici ou <span>parcourez</span>
        </p>
        <small>Images, vidéos, audios, PDF · 100 Mo max · {MAX_FILES} fichiers max</small>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept="image/*,video/*,audio/*,application/pdf"
          onChange={(e) => {
            if (e.target.files) add(e.target.files);
            e.target.value = ""; // permet de re-choisir le même fichier
          }}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="file-item">
              <span>{icon(f)}</span>
              <span className="file-item-name">{f.name}</span>
              <small>{size(f.size)}</small>
              <button
                type="button"
                className="file-remove"
                disabled={disabled}
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                aria-label={`Retirer ${f.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
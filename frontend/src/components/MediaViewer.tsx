import { CoursMedia } from "../types/cours";

interface MediaViewerProps {
  media: CoursMedia;
}

export default function MediaViewer({ media }: MediaViewerProps) {
  switch (media.type) {
    case "VIDEO":
      return <video src={media.url} controls className="cours-media-player" />;
    case "AUDIO":
      return <audio src={media.url} controls />;
    case "IMAGE":
      return <img src={media.url} alt={media.nomFichier} className="cours-media-image" />;
    case "PDF":
      return (
        <div>
          <iframe src={media.url} title={media.nomFichier} className="cours-media-pdf" />
          <a href={media.url} target="_blank" rel="noreferrer" className="cours-media-link">
            Ouvrir {media.nomFichier} dans un nouvel onglet
          </a>
        </div>
      );
    default:
      return (
        <a href={media.url} target="_blank" rel="noreferrer" className="cours-media-link">
          📄 {media.nomFichier}
        </a>
      );
  }
}
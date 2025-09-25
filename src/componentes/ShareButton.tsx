import React from "react";
import { useLocation } from "react-router-dom";
import { FiShare2 } from "react-icons/fi"; // ícone de compartilhar

const ShareButton: React.FC = () => {
  const location = useLocation();

  const handleShare = async () => {
    const currentUrl = window.location.origin + location.pathname + location.search;

    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copiado para a área de transferência!");
    } catch (err) {
      console.error("Erro ao copiar link:", err);
      alert("Não foi possível copiar o link.");
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "22px",
        color: "#007bff",
      }}
      title="Compartilhar"
    >
      <FiShare2 />
    </button>
  );
};

export default ShareButton;

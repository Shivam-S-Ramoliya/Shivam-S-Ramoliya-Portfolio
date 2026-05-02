import { useEffect, useRef } from "react";
import Scene from "./Scene";

const CharacterModel = () => {
  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (!aboutSection || !characterRef.current) return;

      const aboutRect = aboutSection.getBoundingClientRect();
      const isBeforeOrInAbout = aboutRect.bottom > window.innerHeight * 0.2;

      if (isBeforeOrInAbout) {
        characterRef.current.style.opacity = "1";
        characterRef.current.style.pointerEvents = "auto";
      } else {
        characterRef.current.style.opacity = "0";
        characterRef.current.style.pointerEvents = "none";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={characterRef}
      style={{ transition: "opacity 0.5s ease", opacity: "1" }}
    >
      <Scene />
    </div>
  );
};

export default CharacterModel;

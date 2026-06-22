import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";
import { portfolioData } from "../data/portfolioData.jsx";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        document.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "github":
        return <FaGithub />;
      case "linkedin":
        return <FaLinkedinIn />;
      case "instagram":
        return <FaInstagram />;
      case "x":
        return <FaXTwitter />;
      default:
        return null;
    }
  };

  // Only render GitHub, LinkedIn, X, and Instagram in the floating side dock
  const allowedSocials = ["github", "linkedin", "x", "instagram"];
  const sideSocials = (portfolioData.contact.socialLinks || []).filter((social: any) =>
    allowedSocials.includes(social.name.toLowerCase())
  );

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        {sideSocials.map((social: any, index: number) => (
          <span key={index}>
            <a href={social.url} target="_blank" rel="noreferrer">
              {getSocialIcon(social.name)}
            </a>
          </span>
        ))}
      </div>
      {portfolioData.resume.pdfUrl && (
        <a
          className="resume-button"
          href={portfolioData.resume.pdfUrl}
          target="_blank"
          rel="noreferrer"
        >
          <HoverLinks text="RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      )}
    </div>
  );
};

export default SocialIcons;

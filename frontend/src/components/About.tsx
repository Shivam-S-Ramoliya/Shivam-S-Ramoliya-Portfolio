import { portfolioData } from "../data/portfolioData.jsx";
import "./styles/About.css";

const About = () => {
  const { bio } = portfolioData.personal;

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h1 className="title">About Me</h1>
        <p className="para">{bio}</p>
      </div>
    </div>
  );
};

export default About;

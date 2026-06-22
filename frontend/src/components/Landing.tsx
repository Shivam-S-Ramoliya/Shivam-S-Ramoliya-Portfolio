import { PropsWithChildren } from "react";
import { portfolioData } from "../data/portfolioData.jsx";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const { name, titles } = portfolioData.personal;
  const [firstName, ...restName] = name.split(" ");
  const lastName = restName.join(" ");

  const heroTitle = titles[0] ?? "";
  const rolePrimary = titles[1] ?? heroTitle;
  const roleSecondary = titles[2] ?? rolePrimary;
  const roleAltPrimary = titles[3] ?? roleSecondary;
  const roleAltSecondary = titles[4] ?? roleAltPrimary;

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span>{lastName}</span>
                </>
              )}
            </h1>
          </div>
          <div className="landing-info">
            <h3>{heroTitle}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{rolePrimary}</div>
              <div className="landing-h2-2">{roleSecondary}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{roleAltPrimary}</div>
              <div className="landing-h2-info-1">{roleAltSecondary}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;

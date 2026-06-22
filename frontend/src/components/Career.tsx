import { useState } from "react";
import { portfolioData } from "../data/portfolioData.jsx";
import "./styles/Career.css";

const Career = () => {
  const [activeTab, setActiveTab] = useState<"experience" | "education" | "responsibility">("experience");

  const getTabItems = () => {
    switch (activeTab) {
      case "experience":
        return portfolioData.resume.experience || [];
      case "education":
        return portfolioData.resume.education || [];
      case "responsibility":
        return portfolioData.resume.positionsOfResponsibility || [];
      default:
        return [];
    }
  };

  const items = getTabItems();

  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2 className="title">
          My career <span>&</span>
          <br /> experience
        </h2>

        {/* Tab Controls */}
        <div className="career-tabs">
          <button
            className={`career-tab-btn ${activeTab === "experience" ? "active" : ""}`}
            onClick={() => setActiveTab("experience")}
          >
            Experience
          </button>
          <button
            className={`career-tab-btn ${activeTab === "education" ? "active" : ""}`}
            onClick={() => setActiveTab("education")}
          >
            Education
          </button>
          <button
            className={`career-tab-btn ${activeTab === "responsibility" ? "active" : ""}`}
            onClick={() => setActiveTab("responsibility")}
          >
            Responsibility
          </button>
        </div>

        {/* Timeline Content */}
        <div className="career-timeline-container">
          {items.map((item: any, index: number) => {
            const title = item.position || item.degree;
            const subtitle = item.company || item.institution || item.organization;
            const tags = item.technologies || item.responsibilities || [];
            
            return (
              <div className="career-item" key={index}>
                {/* Vertical Timeline Track with Dot */}
                <div className="career-timeline-line">
                  <div className="career-timeline-dot"></div>
                </div>

                {/* Card */}
                <div className="career-card">
                  <div className="career-card-logo">
                    {item.image ? (
                      <img
                        src={item.image.startsWith("/images/") ? item.image : `/images${item.image}`}
                        alt={subtitle}
                      />
                    ) : (
                      <div className="career-logo-placeholder">🏢</div>
                    )}
                  </div>
                  <div className="career-card-content">
                    <div className="career-card-header">
                      <div className="career-card-titles">
                        <h3>{title}</h3>
                        <div className="career-company">
                          <span>🏢</span> {subtitle}
                        </div>
                        {item.location && (
                          <div className="career-location">
                            <span>📍</span> {item.location}
                          </div>
                        )}
                      </div>
                      <div className="career-card-meta">
                        <span className="career-period">{item.period}</span>
                        {item.gpa && <span className="career-gpa">{item.gpa}</span>}
                      </div>
                    </div>
                    <p className="career-description">{item.description}</p>
                    {tags.length > 0 && (
                      <div className="career-tags">
                        {tags.map((tag: string, tagIdx: number) => (
                          <span key={tagIdx} className="career-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;

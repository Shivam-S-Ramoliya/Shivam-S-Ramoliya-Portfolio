import "./styles/TechStack.css";
import { portfolioData } from "../data/portfolioData.jsx";

const TechStack = () => {
  const skillCategories = portfolioData.skillCategories || [];

  return (
    <div className="techstack-section" id="techstack">
      <div className="techstack-container section-container">
        <h2 className="techstack-title">
          My <span>Skills</span> &amp; Technologies
        </h2>

        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th className="col-category">Category</th>
                <th className="col-skills">Skills &amp; Technologies</th>
              </tr>
            </thead>
            <tbody>
              {skillCategories.map((category: any, catIndex: number) => (
                <tr key={catIndex} className="glass-table-row">
                  <td className="cell-category">
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-title">{category.title}</span>
                  </td>
                  <td className="cell-skills">
                    <div className="skills-badge-container">
                      {category.skills.map((skill: any, skillIndex: number) => (
                        <div className="skill-badge-item" key={skillIndex}>
                          <div className="skill-badge-icon">
                            {skill.svgIcon}
                          </div>
                          <span className="skill-badge-name">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TechStack;

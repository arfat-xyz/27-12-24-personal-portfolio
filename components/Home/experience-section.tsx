import {
  mainPageExperienceSectionEducations,
  mainPageExperienceSectionExperiences,
} from "@/lib/constants";
import { LuMedal } from "react-icons/lu";
import { PiGraduationCap } from "react-icons/pi";

const ExperienceSection = () => {
  return (
    <section className="exstudy">
      <div className="flex-left flex-sb container flex">
        <div className="experience">
          <div className="experience_title flex gap-1">
            <LuMedal />
            <h2>My Experience</h2>
          </div>
          <div className="exper_cards">
            {mainPageExperienceSectionExperiences.map(
              ({ companyName, duration, position }, i) => (
                <div key={i} className="exper_card">
                  <span>{duration}</span>
                  <h3>{companyName}</h3>
                  <p>{position}</p>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="education">
          <div className="experience_title flex gap-1">
            <PiGraduationCap />
            <h2>My Education</h2>
          </div>
          <div className="exper_cards">
            {mainPageExperienceSectionEducations.map(
              ({ companyName, duration, position }, i) => (
                <div key={i} className="exper_card">
                  <span>{duration}</span>
                  <h3>{companyName}</h3>
                  <p>{position}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

import { mainPageSkillsSectionSkills } from "@/lib/constants";

const SkillsSection = () => {
  return (
    <section className="myskills">
      <div className="container">
        <div className="myskills_title">
          <h2>My Skills</h2>
          <p>
            We put your ideas and thus your wishes in the form of a unique web
            project that inspires you and your customers.
          </p>
        </div>
        <div className="myskils_cards">
          {mainPageSkillsSectionSkills.map(({ image, name, percentage }, i) => (
            <div className="mys_card" key={i}>
              <div className="mys_inner">
                <img src={image} alt={name} />
                <h2>{percentage}</h2>
              </div>
              <p className="text-center">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

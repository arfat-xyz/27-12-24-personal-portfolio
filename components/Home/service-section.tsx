"use client";
import { mainPageServicesSection } from "@/lib/constants";
import { formatNumber } from "@/utils/helpers";
import { useState } from "react";
import { GoArrowUpRight } from "react-icons/go";

const ServiceSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleHover = (i: number) => setActiveIndex(i);
  const handleMouseOut = () => setActiveIndex(0);

  return (
    <section className="services">
      <div className="container">
        <div className="services_titles">
          <h2>MY Quality Services</h2>
          <p>
            We put your ideas and thus your wishes in the form of a unique web
            project that inspires you and your customers
          </p>
        </div>
        <div className="services_menu">
          {mainPageServicesSection.map(({ description, title }, i) => (
            <>
              <div
                className={`services_item ${activeIndex === i ? "sactive" : ""}`}
                onMouseOver={() => handleHover(i)}
                onMouseOut={handleMouseOut}
              >
                <div className="left_s_box" key={i}>
                  <span className="">{formatNumber(i + 1)}</span>
                  <h3>{title}</h3>
                </div>
                <div className="right_s_box">
                  <p>{description}</p>
                </div>
                <GoArrowUpRight />
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;

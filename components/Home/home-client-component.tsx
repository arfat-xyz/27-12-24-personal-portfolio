"use client";
import BreadcrumbWithAdminPanel from "@/components/breadcrumb-with-admin-panel";
import FourCardComponent from "@/components/four-card-component";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState } from "react";
import { Blog, BlogStatus } from "@prisma/client";

type MonthlyData = {
  [year: number]: number[]; // A year maps to an array of monthly counts (12 months)
};
const HomeClientComponent = ({ blogs }: { blogs: Blog[] }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const [blogData, setBlogData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [photosData, setPhotosData] = useState([]);
  const [shopData, setShopData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // define_option within the component scope
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top", // Ensure this matches one of the allowed types
      },
      title: {
        display: true,
        text: "Blogs Created Monthly by Year",
      },
    },
  };

  // Aggregate data by year and month
  const monthlyData: MonthlyData = blogs
    .filter((dat) => dat?.status === BlogStatus.Publish)
    .reduce((acc: MonthlyData, blog) => {
      const year = new Date(blog.createdAt).getFullYear();
      const month = new Date(blog.createdAt).getMonth();
      acc[year] = acc[year] || Array(12).fill(0);
      acc[year][month]++;
      return acc;
    }, {} as MonthlyData); // Explicitly set the initial value as MonthlyData

  const currentYear = new Date().getFullYear(); // get the current year
  const years = Object.keys(monthlyData);
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const datasets = years?.map((year) => ({
    label: year.toString(), // Convert year to string, if necessary
    data: monthlyData[+year] || Array(12).fill(0), // Convert string to number with `+year`
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`,
  }));

  const data = {
    labels,
    datasets,
  };
  const cardsArr = [
    {
      heading: "Total Blogs",
      count: blogs.filter((blog) => blog.status === BlogStatus.Publish).length,
    },
    { heading: "Total Projects", count: 5 },
    { heading: "Total Products", count: 5 },
    { heading: "Total Photos", count: 5 },
  ];
  return (
    <>
      {" "}
      <div className="dashboard">
        {" "}
        <BreadcrumbWithAdminPanel
          h2Title="Admin"
          spanTitleOne={`Dashboard`}
          spanTitleTwo="Addblog"
        />
        {/* dashboard four cards */}
        <div className="topfourcards flex flex-sb">
          {cardsArr.map((card, i) => (
            <FourCardComponent
              key={i}
              count={card.count}
              heading={card.heading}
            />
          ))}
        </div>
        {/* year overview */}
        <div className="year_overview flex flex-sb">
          <div className="leftyearoverview">
            <div className="flex flex-sb">
              <h3>Year Overview</h3>
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>
              <h3 className="text-right">
                ${cardsArr[0].count} / 365 <br />
                Total Published
              </h3>
            </div>
            <Bar options={options} data={data} />
          </div>
          <div className="right_salescont">
            <div className="">
              <h3>Blogs By Category</h3>
              <ul className="creative-dots">
                <li className="big-dot"></li>
                <li className="semi-big-dot"></li>
                <li className="medium-dot"></li>
                <li className="semi-medium-dot"></li>
                <li className="semi-small-dot"></li>
                <li className="small-dot"></li>
              </ul>
            </div>

            <div className="blogscategory flex flex-center">
              <table>
                <thead>
                  <tr>
                    <td>Next Js</td>
                    {/* <td>
                      {
                        blogs.filter((d) => d.blogCategory[0] === "Next js")
                          .length
                      }
                    </td> */}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeClientComponent;

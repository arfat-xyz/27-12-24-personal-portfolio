"use client";
import BreadcrumbWithAdminPanel from "@/components/breadcrumb-with-admin-panel";
import FourCardComponent from "@/components/four-card-component";
import { Blog, BlogCategory, BlogStatus, Photo, Project } from "@prisma/client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

type MonthlyData = {
  [year: number]: number[]; // A year maps to an array of monthly counts (12 months)
};
const DashboardClientComponent = ({
  blogs,
  categories,
  projects,
  gallery,
}: {
  blogs: Blog[];
  categories: (BlogCategory & { count: number })[];
  projects: Project[];
  gallery: Photo[];
}) => {
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
    {
      heading: "Total Projects",
      count: projects.filter((blog) => blog.status === BlogStatus.Publish)
        .length,
    },
    { heading: "Total Products", count: 5 },
    { heading: "Total Photos", count: gallery.length },
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
        <div className="topfourcards flex-sb flex">
          {cardsArr.map((card, i) => (
            <FourCardComponent
              key={i}
              count={card.count}
              heading={card.heading}
            />
          ))}
        </div>
        {/* year overview */}
        <div className="year_overview flex-sb flex">
          <div className="leftyearoverview">
            <div className="flex-sb flex">
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

            <div className="blogscategory flex-center flex">
              <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-4">{cat.name}</td>
                      <td className="px-6 py-4">{cat.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* <table>
                <thead className="block w-full">
                  <tr>
                    <td>Name</td>
                    <td>Count</td>
                  </tr>
                </thead>
                <tbody className="h-[500px] overflow-y-scroll block w-full">
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td> {cat.name} </td>
                      <td> {cat.count} </td>
                    </tr>
                  ))}
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td> {cat.name} </td>
                      <td> {cat.count} </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardClientComponent;

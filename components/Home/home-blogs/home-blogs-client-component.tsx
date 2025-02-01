"use client";

import Spinner from "@/components/spinner";
import { useFetchData } from "@/hoooks/useFetchData";
import { imageConfig } from "@/lib/image-config";
import { Blog, BlogCategory } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const HomeBlogsClientComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit] = useState(10);
  const { allData, isLoading } = useFetchData<
    Blog & {
      categories: BlogCategory[];
    }
  >(`/api/blogs?limit=${limit}&q=${searchQuery}&page=${currentPage}`);
  return (
    <div className="blogpage">
      <section className="tophero">
        <div className="container">
          <div className="toptitle">
            <div className="toptitlecont flex">
              <h1>
                Welcome to<span> Arfat Blogs!</span>
              </h1>
              <p>
                I Write about web, mobile development and modern JavaScript
                frameworks. <br /> The best articles, links and news relateed to
                web and mobile development
              </p>
              <div className="subemail">
                <form className="flex">
                  <input placeholder="Search blogs here...." type="text" />
                  <button>Search</button>
                </form>
              </div>
            </div>
          </div>
          <div className="featured">
            <div className="container">
              <div className="border">
                <div className="featuredposts">
                  <div className="fetitle flex">
                    <h3>Featured Posts :</h3>
                  </div>
                  <div className="feposts flex">
                    <Swiper
                      slidesPerView={"auto"}
                      freeMode={true}
                      spaceBetween={30}
                      className="mySwiper"
                      modules={[FreeMode]}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <>
                          {!allData.length ? (
                            <h3> No Blogs Found </h3>
                          ) : (
                            allData.map((blog) => (
                              <SwiperSlide key={blog?.id}>
                                <div className="fpost">
                                  <Link href={`/blogs/${blog?.slug}`}>
                                    <img
                                      src={blog.images[0]}
                                      alt={blog.title}
                                    />
                                  </Link>
                                  <div className="fpostinfo">
                                    <div className="tegs flex">
                                      {blog.categories.map((cat) => (
                                        <Link
                                          href={`/blogs/category/${cat.id}`}
                                          key={cat.id}
                                          className="ai"
                                        >
                                          <span></span>
                                          {cat.name}
                                        </Link>
                                      ))}
                                    </div>
                                    <h2>
                                      <Link href={`/blogs/${blog?.slug}`}>
                                        {blog.title}
                                      </Link>
                                      <div className="fpostby flex">
                                        <img
                                          src={imageConfig.coderJPG}
                                          alt="Arfatur Rahman image"
                                        />
                                        <p>By Arfatur Rahman</p>
                                      </div>
                                    </h2>
                                  </div>
                                </div>
                              </SwiperSlide>
                            ))
                          )}
                        </>
                      )}
                    </Swiper>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeBlogsClientComponent;

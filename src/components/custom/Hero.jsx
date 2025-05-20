import React, { useState, useEffect, useContext } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { LogInContext } from "@/Context/LogInContext/Login";
import Marquee from "../ui/marquee";

function Hero({ heroRef }) {
  const { isAuthenticated } = useContext(LogInContext);
  
  const images = [
    {
      name: "Chichen Itza",
      src: "/hero/chichen.webp",
      link: "https://en.wikipedia.org/wiki/Chichen_Itza",
    },
    {
      name: "Christ the Redeemer",
      src: "/hero/christ.webp",
      link: "https://en.wikipedia.org/wiki/Christ_the_Redeemer_(statue)",
    },
    {
      name: "Colosseum",
      src: "/hero/colosseum.webp",
      link: "https://en.wikipedia.org/wiki/Colosseum",
    },
    {
      name: "Great Pyramid of Giza",
      src: "/hero/giza.webp",
      link: "https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza",
    },
    {
      name: "Machu Picchu",
      src: "/hero/peru.webp",
      link: "https://en.wikipedia.org/wiki/Machu_Picchu",
    },
    {
      name: "Taj Mahal",
      src: "/hero/taj.webp",
      link: "https://en.wikipedia.org/wiki/Taj_Mahal",
    },
    {
      name: "India Gate",
      src: "/hero/india.webp",
      link: "https://en.wikipedia.org/wiki/India_Gate",
    },
    {
      name: "Great Wall of China",
      src: "/hero/wall.webp",
      link: "https://en.wikipedia.org/wiki/Great_Wall_of_China",
    },
    {
      name: "Eiffel Tower",
      src: "/hero/tower.webp",
      link: "https://en.wikipedia.org/wiki/Eiffel_Tower",
    },
    {
      name: "Statue of Liberty",
      src: "/hero/liberty.webp",
      link: "https://en.wikipedia.org/wiki/Statue_of_Liberty",
    },
    {
      name: "Sydney Opera House",
      src: "/hero/sydney.webp",
      link: "https://en.wikipedia.org/wiki/Sydney_Opera_House",
    },
    {
      name: "Mount Everest",
      src: "/hero/everest.webp",
      link: "https://en.wikipedia.org/wiki/Mount_Everest",
    },
    {
      name: "Stonehenge",
      src: "/hero/stonehenge.webp",
      link: "https://en.wikipedia.org/wiki/Stonehenge",
    },
  ];


  const first = images.slice(0, images.length / 2);
  const second = images.slice(images.length / 2);
 
  return (
    <div
      ref={heroRef}
      className="flex items-center flex-col text-center justify-center min-h-screen py-10"
    >
       <video autoPlay loop muted playsInline className="absolute z-[-1] w-full h-full object-cover" src="/public/vid/nigj.mp4">

        Your browser does not support the video tag.
      </video>
      <div className="text px-10 md:px-40 flex flex-col items-center justify-center gap-4">
        <div className="heading p-2 md:py-5">
          <h1 className="font-black text-3xl md:text-5xl bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Embark on Electrifying <br /> Adventures with
          </h1>
          <h1 className="font-black text-5xl md:text-9xl bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent pb-4">
          𝖲𝖸𝖭𝖳𝖧𝖳𝖱𝖤𝖪
          </h1>
        </div>
        <div className="desc">
          <h5 className="opacity-90 mx-auto text-center text-lg font-medium tracking-tight text-primary/80 bg-colored bg-clip-text text-transparent md:text-xl">
            Your trusted trip planner and adventure guide.
          </h5>
        </div>
        <div className="buttons flex flex-col gap-3 md:flex-row">
          <Link to="/plan-a-trip">
            <Button 
              className="
                bg-white 
                text-black 
                hover:bg-white/90 
                px-8 
                py-4 
                text-lg 
                font-bold 
                rounded-xl 
                shadow-2xl 
                hover:shadow-primary/50 
                transition-all 
                duration-300 
                hover:scale-105 
                active:scale-95 
                hover:text-blue-600
              "
            >
              {isAuthenticated
                ? "Let's Make Another Trip"
                : "Plan a Trip, It's Free"}
            </Button>
          </Link>
        </div>
        <div className="marquee relative flex w-screen max-w-full flex-col items-center justify-center overflow-hidden">
          <Marquee reverse pauseOnHover className="[--duration:60s] w-full">
            {second.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="img cursor-pointer border-2 hover:border-foreground transition-all overflow-hidden rounded-md min-w-[250px] md:min-w-[300px] mx-2"
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-[200px] md:h-[250px] object-cover hover:scale-110 duration-300"
                    loading="lazy"
                    role="presentation"
                    fetchPriority="high"
                  />
                </Link>
              );
            })}
          </Marquee>
          <Marquee pauseOnHover className="[--duration:60s] w-full mt-4">
            {first.map((item, index) => {
              return (
                <Link
                  key={index}
                  to={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
              className="img cursor-pointer border-2 hover:border-foreground transition-all overflow-hidden rounded-md sm:min-w-[250px] sm:h-[250px] min-w-[100px] md:min-w-[100px] mx-2"
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-[200px] md:h-[250px] object-cover hover:scale-110 duration-300"
                    loading="lazy"
                    role="presentation"
                    fetchPriority="high"
                  />
                </Link>
              );
            })}
          </Marquee>

          {/* Removed gradient overlay divs */}
        </div>
      </div>
    </div>
  );
}

export default Hero;
import React from "react";
import "./aboutSection.css";

import { Avatar, Button, Typography } from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube'
import LinkedInIcon from '@mui/icons-material/LinkedIn'


const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/meabhisingh";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/djahrqrul/image/upload/v1690307893/zau4r7qoepu3zwhdu32y.jpg"
              alt="Founder"
            />
            <Typography>Tosif Kankod</Typography>
            <span>
              This is a sample wesbite made by @tosifkankod. By Using MERN and Other Technologies
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>

            <a href="http://linkedin.com/in/tosif-kankod" target="blank">
              <LinkedInIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
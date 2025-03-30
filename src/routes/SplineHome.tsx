import React from "react";
import Spline from "@splinetool/react-spline";
import Btn from "../components/ui/Btn";

import { Link } from "react-router-dom";

const SplineHome = () => {
  return (
    <div className="relative">
      <div className="hero w-[40%] h-auto flex flex-col gap-3 absolute top-52 bg-transparent left-40">
        <h1 className="text-[2.5rem] font-semibold">
          Boost Your Career with AI-Powered Resume & Interview Analysis
        </h1>
        <h3 className="text-[1.2rem]">
          Optimize your resume, ace mock interviews, and get job recommendations
          - all in one place!
        </h3>
        <div className="btns mt-6  flex gap-8">

          <Link to={"/analyzer"} >
            <Btn label="Analyse Resume" />
          </Link>


          <Link to={"/generate"}>
            <Btn label="Start Mock Interview" />
          </Link>

          <Link to={"/speech-analyze"}>
            <Btn label="Speech analyzer" />
          </Link>
        </div>
      </div>
      <div className="w-full" style={{ height: "100vh" }}>
        <Spline
          className="w-full h-[500px] rounded-xl shadow-lg border border-gray-300"
          scene="https://prod.spline.design/FxzHvalyrO-yCovj/scene.splinecode"
        ></Spline>
      </div>
    </div>
  );
};

export default SplineHome;

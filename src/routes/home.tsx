import { DotLottiePlayer } from "@dotlottie/react-player";
import SplineHome from "./SplineHome";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoader(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence >
        {loader && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-50"
          >
            <DotLottiePlayer
              src="/assets/svg/home loader.lottie"
              autoplay
              loop
              style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 200,
                backgroundColor: "white",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <SplineHome />
    </>
  );
};

export default HomePage;

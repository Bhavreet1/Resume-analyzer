import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <motion.img
        src="/assets/svg/logo1.svg"
        alt=""
        className="w-10 h-10 object-contain "
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </Link>
  );
};

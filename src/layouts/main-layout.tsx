import { Container } from "@/components/container";
// import { Footer } from "@/components/footer";

import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#E3EEF6] to-[#1082fd57]">
      <Header />

      <Container className="p-0 h-full flex">
        <main className="flex-grow">
          <Outlet />
        </main>
      </Container>

      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;

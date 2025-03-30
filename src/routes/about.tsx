import { Sparkles } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="flex-col w-full pb-24">
      <Container>
        <div className="my-8 text-center md:text-left">
          <h2 className="text-3xl md:text-6xl font-extrabold">
            <span className="text-outline md:text-8xl">About Us</span>
            <span className="text-gray-500"> - Who we are?</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            We are on a mission to help job seekers ace their interviews with AI-driven insights. Our platform provides smart guidance to boost your confidence and increase your success rate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <img
            src="/assets/img/about.jpg"
            alt="About Us"
            className="w-full h-96 rounded-md object-cover"
          />
          <div className="text-center md:text-left space-y-6">
            <p className="text-muted-foreground">
              Our AI-powered platform helps you prepare, practice, and perfect your interview skills, ensuring you stand out in today's competitive job market.
            </p>
            <Link to="/contact">
              <Button>
                Contact Us <Sparkles className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;

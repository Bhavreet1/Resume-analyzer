import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { LoaderPage } from "./routes/loader-page";

// Lazy load components
const PublicLayout = lazy(() => import("@/layouts/public-layout"));
const AuthenticationLayout = lazy(() => import("@/layouts/auth-layout"));
const ProtectRoutes = lazy(() => import("@/layouts/protected-routes"));
const MainLayout = lazy(() => import("@/layouts/main-layout"));
const HomePage = lazy(() => import("@/routes/home"));
const SignInPage = lazy(() => import("./routes/sign-in"));
const SignUpPage = lazy(() => import("./routes/sign-up"));
const Generate = lazy(() => import("./components/generate"));
const Dashboard = lazy(() => import("./routes/dashboard"));
const CreateEditPage = lazy(() => import("./routes/create-edit-page"));
const MockLoadPage = lazy(() => import("./routes/mock-load-page"));
const MockInterviewPage = lazy(() => import("./routes/mock-interview-page"));
const Feedback = lazy(() => import("./routes/feedback"));
const AboutPage = lazy(() => import("./routes/about"));
const ResumeAnalyzer = lazy(() => import("./components/ResumeAnlyzer"));
const SpeechRecorder = lazy(() => import("./components/SpeechRecorder"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoaderPage />}>
        <Routes>
          {/* public routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          {/* authentication layout */}
          <Route element={<AuthenticationLayout />}>
            <Route path="/signin/*" element={<SignInPage />} />
            <Route path="/signup/*" element={<SignUpPage />} />
          </Route>

          {/* protected routes */}
          <Route
            element={
              <ProtectRoutes>
                <MainLayout />
              </ProtectRoutes>
            }
          >
            {/* add all the protect routes */}
            <Route element={<Generate />} path="/generate">
              <Route index element={<Dashboard />} />
              <Route path=":interviewId" element={<CreateEditPage />} />
              <Route path="interview/:interviewId" element={<MockLoadPage />} />
              <Route
                path="interview/:interviewId/start"
                element={<MockInterviewPage />}
              />
              <Route path="feedback/:interviewId" element={<Feedback />} />
            </Route>

            <Route element={<ResumeAnalyzer />} path="/analyzer" />
            <Route element={<SpeechRecorder />} path="/speech-analyze" />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

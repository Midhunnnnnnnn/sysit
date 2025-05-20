import { useState, useEffect, useContext, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/custom/Header.jsx";
import Hero from "./components/custom/Hero.jsx";
import CreateTrip from "./components/routes/plan-a-trip/CreateTrip.jsx";
import Mytrips from "./components/routes/my-trips/[tripId]/Mytrips.jsx";
import { LogInContext } from "./Context/LogInContext/Login.jsx";
import Footer from "./components/custom/Footer.jsx";
import Alltrips from "./components/routes/all-trips/Alltrips.jsx";
import toast from "react-hot-toast";
import gsap from "gsap";
import ProgressBar from "./components/constants/ProgressBar.jsx";
import { useRefContext } from "./Context/RefContext/RefContext.jsx";

const loadingTexts = [
  "Let's Go!",
  "¡Vamos!",
  "Vaayoo!",
  "Allons-y!",
  "Lass uns gehen!",
  "Andiamo!",
  "さあ行こう!",
  "이제 가자!",
  "我们走吧!",
  "Давай поехали!",
  "Chalo!"
];

function LoadingScreen({ onFinish }) {
  const [textIndex, setTextIndex] = useState(0);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => prev + 1);
      setSpeed((prev) => Math.max(prev * 0.8, 200));
    }, speed);

    setTimeout(() => {
      clearInterval(interval);
      onFinish();
    }, loadingTexts.length * speed);

    return () => clearInterval(interval);
  }, [onFinish, speed]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-4xl font-bold">
      {textIndex < loadingTexts.length && <div>{loadingTexts[textIndex]}</div>}
    </div>
  );
}

function App() {
  const { user, isAuthenticated } = useContext(LogInContext);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const createTripPageRef = useRef(null);
  const footerRef = useRef(null);
  const { locationInfoRef } = useRefContext();

  useEffect(() => {
    if (!loggedIn && isAuthenticated) {
      setLoggedIn(true);
      toast.success("Logged In Successfully");
    }
  }, [user]);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "elastic.out(1,1)" } });
    timeline.from(headerRef.current, { delay: 0.5, opacity: 0, y: -100 });
    return () => {
      timeline.kill();
    };
  }, [location.pathname]);

  return (
    <>
      {loading && <LoadingScreen onFinish={() => setLoading(false)} />} 
      {!loading && (
        <>
          <ProgressBar />
          <div className="app tracking-tighter min-w-[320px]">
            <Header headerRef={headerRef} />
            <div className="container max-w-[1024px] w-full min-w-[320px] h-auto">
              <Routes>
                <Route path="/" element={<Hero heroRef={heroRef} />} />
                <Route path="/plan-a-trip" element={<CreateTrip createTripPageRef={createTripPageRef} />} />
                <Route path="/my-trips/:tripId" element={isAuthenticated ? <Mytrips /> : <Hero />} />
                <Route path="/all-trips" element={isAuthenticated ? <Alltrips /> : <Hero />} />
              </Routes>
            </div>
            <Footer footerRef={footerRef} />
          </div>
        </>
      )}
    </>
  );
}

export default App;

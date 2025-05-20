import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState, useRef } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  PROMPT,
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { chatSession } from "@/Service/AiModel";
import { LogInContext } from "@/Context/LogInContext/Login";
import Globe from "@/components/ui/globe";

import { db } from "@/Service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import { LoadingAnimation } from "@/components/ui/loading-animation";

function CreateTrip({ createTripPageRef }) {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(false);
  const navigate = useNavigate();

  // Refs for each section
  const textRef = useRef(null);
  const placeRef = useRef(null);
  const dayRef = useRef(null);
  const budgetRef = useRef(null);
  const peopleRef = useRef(null);
  const buttonRef = useRef(null);

  // State for visibility
  const [isVisible, setIsVisible] = useState({
    text: false,
    place: false,
    day: false,
    budget: false,
    people: false,
    button: false
  });

  const { user, loginWithPopup, isAuthenticated } = useContext(LogInContext);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.dataset.section]: entry.isIntersecting
          }));
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    // Observe each section
    if (textRef.current) {
      textRef.current.dataset.section = "text";
      observer.observe(textRef.current);
    }
    if (placeRef.current) {
      placeRef.current.dataset.section = "place";
      observer.observe(placeRef.current);
    }
    if (dayRef.current) {
      dayRef.current.dataset.section = "day";
      observer.observe(dayRef.current);
    }
    if (budgetRef.current) {
      budgetRef.current.dataset.section = "budget";
      observer.observe(budgetRef.current);
    }
    if (peopleRef.current) {
      peopleRef.current.dataset.section = "people";
      observer.observe(peopleRef.current);
    }
    if (buttonRef.current) {
      buttonRef.current.dataset.section = "button";
      observer.observe(buttonRef.current);
    }

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
      if (placeRef.current) observer.unobserve(placeRef.current);
      if (dayRef.current) observer.unobserve(dayRef.current);
      if (budgetRef.current) observer.unobserve(budgetRef.current);
      if (peopleRef.current) observer.unobserve(peopleRef.current);
      if (buttonRef.current) observer.unobserve(buttonRef.current);
    };
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const SignIn = async () => {
    loginWithPopup();
  };

  const SaveUser = async () => {
    const User = JSON.parse(localStorage.getItem("User"));
    const id = User?.email;
    await setDoc(doc(db, "Users", id), {
      userName: User?.name,
      userEmail: User?.email,
      userPicture: User?.picture,
      userNickname: User?.nickname,
    });
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem("User", JSON.stringify(user));
      SaveUser();
    }
  }, [user]);

  const SaveTrip = async (TripData) => {
    const User = JSON.parse(localStorage.getItem("User"));
    const id = Date.now().toString();
    setIsLoading(true);
    await setDoc(doc(db, "Trips", id), {
      tripId: id,
      userSelection: formData,
      tripData: TripData,
      userName: User?.name,
      userEmail: User?.email,
    });
    setIsLoading(false);
    localStorage.setItem("Trip", JSON.stringify(TripData));
    navigate("/my-trips/" + id);
  };

  const generateTrip = async () => {
    if (!isAuthenticated) {
      toast("Sign In to continue", {
        icon: "⚠️",
      });
      return setIsDialogOpen(true);
    }
    if (
      !formData?.noOfDays ||
      !formData?.location ||
      !formData?.People ||
      !formData?.Budget
    ) {
      return toast.error("Please fill out every field or select every option.");
    }
    if (formData?.noOfDays > 5) {
      return toast.error("Please enter Trip Days less then 5");
    }
    if (formData?.noOfDays < 1) {
      return toast.error("Invalid number of Days");
    }
    const FINAL_PROMPT = PROMPT.replace(/{location}/g, formData?.location)
      .replace(/{noOfDays}/g, formData?.noOfDays)
      .replace(/{People}/g, formData?.People)
      .replace(/{Budget}/g, formData?.Budget);

    try {
      setShowLoadingAnimation(true);
      setIsLoading(true);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const trip = JSON.parse(result.response.text());
      setIsLoading(false);
      setShowLoadingAnimation(false);
      SaveTrip(trip);
      toast.success("Trip Generated Successfully");
    } catch (error) {
      setIsLoading(false);
      setShowLoadingAnimation(false);
      toast.error("Failed to generate trip. Please try again.");
      console.error(error);
    }
  };

  return (
    <div ref={createTripPageRef} className="mt-10 text-center relative overflow-hidden">
      {showLoadingAnimation && <LoadingAnimation />}
      
      {/* Globe Background */}
      <div className="absolute -right-400 -top-20 md:-right-100 lg:right-0 md:top-0 w-full md:w-1/2 h-[400px] md:h-[600px] z-0 opacity-20 hover:opacity-30 transition-opacity duration-300">
        <Globe />
      </div>

      {/* Text Section */}
      <div 
        ref={textRef}
        data-section="text"
        className={`transition-opacity duration-500 ${isVisible.text ? "opacity-100" : "opacity-0"}`}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-5 flex items-center justify-center">
          <span className="hidden md:block">🚀</span>{" "}
          <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Share Your Travel Preferences{" "}
          </span>{" "}
          <span className="hidden md:block">🚀</span>
        </h2>
        <p className="opacity-90 mx-auto text-center text-md md:text-xl font-medium tracking-tight text-primary/80">
          Embark on your dream adventure with just a few simple details. <br />   
          <span className="bg-gradient-to-b text-2xl from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
            SYNTHTREK
          </span>{" "}
          <br /> will curate a personalized itinerary, crafted to match your
          unique preferences!
        </p>
      </div>

      <div className="form mt-14 flex flex-col gap-16 md:gap-20">
        {/* Place Section */}
        <div 
          ref={placeRef}
          data-section="place"
          className={`transition-opacity duration-500 ${isVisible.place ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Where do you want to Explore?
            </span>{" "}
            🏖️
          </h2>
          <ReactGoogleAutocomplete
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
            apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            autoFocus
            onPlaceSelected={(place) => {
              setPlace(place);
              handleInputChange("location", place.formatted_address);
            }}
            placeholder="Enter a City"
          />
        </div>

        {/* Day Section */}
        <div 
          ref={dayRef}
          data-section="day"
          className={`transition-opacity duration-500 ${isVisible.day ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              How long is your Trip?
            </span>{" "}
            🕜
          </h2>
          <Input
            className="text-center"
            placeholder="Ex: 2"
            type="number"
            min="1"
            max="5"
            name="noOfDays"
            required
            onChange={(day) => handleInputChange("noOfDays", day.target.value)}
          />
        </div>

        {/* Budget Section */}
        <div 
          ref={budgetRef}
          data-section="budget"
          className={`transition-opacity duration-500 ${isVisible.budget ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              {" "}
              What is your Budget?
            </span>{" "}
            💳
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectBudgetOptions.map((item) => {
              return (
                <div
                  onClick={(e) => handleInputChange("Budget", item.title)}
                  key={item.id}
                  className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border hover:shadow-foreground/10 hover:shadow-md rounded-lg
                  ${
                    formData?.Budget == item.title &&
                    "border border-foreground/80"
                  }
                  `}
                >
                  <h3 className="font-bold text-[15px] md:font-[18px]">
                    {item.icon} <span className={`
                      ${formData?.Budget == item.title ? 
                      "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent" :
                      ""}
                      `}>{item.title}</span>
                  </h3>
                  <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* People Section */}
        <div 
          ref={peopleRef}
          data-section="people"
          className={`transition-opacity duration-500 ${isVisible.people ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="font-semibold  text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Who are you traveling with?{" "}
            </span>{" "}
            🚗
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectNoOfPersons.map((item) => {
              return (
                <div
                  onClick={(e) => handleInputChange("People", item.no)}
                  key={item.id}
                  className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-foreground/10 hover:shadow-md
                    ${formData?.People == item.no && "border border-foreground/80"}
                  `}
                >
                  <h3 className="font-bold text-[15px] md:font-[18px]">
                    {item.icon} <span className={`
                      ${formData?.People == item.no ? 
                      "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent" :
                      ""}
                      `}>{item.title}</span>
                  </h3>
                  <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.desc}</p>
                  <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">{item.no}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div 
        ref={buttonRef}
        data-section="button"
        className={`create-trip-btn w-full flex items-center justify-center h-32 transition-opacity duration-500 ${isVisible.button ? "opacity-100" : "opacity-0"}`}
      >
        <Button disabled={isLoading} onClick={generateTrip}>
          {isLoading ? (
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
          ) : (
            "Let's Go 🌏"
          )}
        </Button>
      </div>

      <Dialog
        className="m-4"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              {user ? "Thank you for LogIn" : "Sign In to Continue"}
            </DialogTitle>
            <DialogDescription>
              <span className="flex gap-2">
                <span className="text-center w-full opacity-90 mx-auto tracking-tight text-primary/80">
                  {user
                    ? "Logged In Securely to JourneyJolt with Google Authentication"
                    : "Sign In to JourneyJolt with Google Authentication Securely"}
                </span>
              </span>
              {user ? (
                ""
              ) : (
                <Button
                  onClick={SignIn}
                  className="w-full mt-5 flex gap-2 items-center justify-center"
                >
                  Sign In with <FcGoogle className="h-5 w-5" />
                </Button>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="w-full">
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
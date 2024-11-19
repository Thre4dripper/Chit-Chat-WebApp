import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import LottieLoading from "./LottieLoading.tsx";
import { useAuthUser } from "../contexts/UserData.tsx";
import {getAuth, onAuthStateChanged } from "firebase/auth";

interface ProtectiveRouteProps {
  children: React.ReactNode;
}

const ProtectiveRoute: React.FC<ProtectiveRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const {
    userData,
    fetchUserData,
    logout,
    isLoading,
    setIsLoading,
  } = useAuthUser();

  useEffect(() => {
    // if user Exist not call
    if (userData) {
      return;
    }
    setIsLoading(true);

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user);
        console.log("Current User:", user); // This will be the authenticated user
      } else {
        logout();
        setIsLoading(false);
        navigate("/auth");
        console.log("No user is signed in");
      }
    });
    setIsLoading(false);
    return () => unsubscribe();
  }, [getAuth,userData]);

  if (isLoading || !userData) {
    return <LottieLoading />;
  }
  return <>{children}</>;
};

export default ProtectiveRoute;

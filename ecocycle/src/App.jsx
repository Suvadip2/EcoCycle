import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";

import UserDashboard from "./pages/UserDashboard";
import SubmitEWaste from "./pages/SubmitEWaste";
import MyRequests from "./pages/MyRequests";
import TrackRequest from "./pages/TrackRequest";
import EnvironmentalImpact from "./pages/EnvironmentalImpact";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRequests from "./pages/AdminRequests";
import AdminUsers from "./pages/AdminUsers";

import { useAuth } from "./context/AuthContext";

function App() {
  const [currentPage, setCurrentPageState] = useState(() => {
    const pageFromUrl = window.location.hash.replace("#", "");
    return pageFromUrl || sessionStorage.getItem("currentPage") || "home";
  });
  const [navigationVersion, setNavigationVersion] = useState(0);

  const [selectedRequestId, setSelectedRequestId] = useState(() => {
    const savedId = sessionStorage.getItem("selectedRequestId");

    return savedId ? Number(savedId) : null;
  });

  const { isLoggedIn, role } = useAuth();


  /* =========================
     PAGE NAVIGATION
  ========================= */

  const setCurrentPage = (page) => {
    setCurrentPageState(page);
    setNavigationVersion((version) => version + 1);

    sessionStorage.setItem(
      "currentPage",
      page
    );

    window.history.pushState(
      { page: page },
      "",
      `#${page}`
    );
  };


  /* =========================
     BROWSER BACK / FORWARD
  ========================= */

  useEffect(() => {
    const handlePopState = (event) => {
      setNavigationVersion((version) => version + 1);

      if (event.state?.page) {
        setCurrentPageState(
          event.state.page
        );

        sessionStorage.setItem(
          "currentPage",
          event.state.page
        );

        return;
      }

      const hash = window.location.hash.replace(
        "#",
        ""
      );

      if (hash) {
        setCurrentPageState(hash);

        sessionStorage.setItem(
          "currentPage",
          hash
        );
      } else {
        setCurrentPageState("home");

        sessionStorage.setItem(
          "currentPage",
          "home"
        );
      }
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);


  /* =========================
     INITIAL HISTORY ENTRY
  ========================= */

  useEffect(() => {
    const currentHash =
      window.location.hash.replace("#", "");

    if (!currentHash) {
      window.history.replaceState(
        { page: currentPage },
        "",
        `#${currentPage}`
      );
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === "about" || currentPage === "categories") {
      document.getElementById(currentPage)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (currentPage === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, navigationVersion]);


  const renderPage = () => {

    /* =========================
       PUBLIC PAGES
    ========================= */

    if (
      currentPage === "home" ||
      currentPage === "about" ||
      currentPage === "categories"
    ) {
      return (
        <Home
          setCurrentPage={setCurrentPage}
        />
      );
    }

    if (currentPage === "login") {
      return (
        <Login
          setCurrentPage={setCurrentPage}
        />
      );
    }

    if (currentPage === "register") {
      return (
        <Register
          setCurrentPage={setCurrentPage}
        />
      );
    }

    if (currentPage === "adminLogin") {
      return (
        <AdminLogin
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       USER DASHBOARD
    ========================= */

    if (currentPage === "dashboard") {
      if (!isLoggedIn || role !== "USER") {
        return (
          <Login
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <UserDashboard
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       SUBMIT E-WASTE
    ========================= */

    if (currentPage === "submitEWaste") {
      if (!isLoggedIn || role !== "USER") {
        return (
          <Login
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <SubmitEWaste
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       MY REQUESTS
    ========================= */

    if (currentPage === "myRequests") {
      if (!isLoggedIn || role !== "USER") {
        return (
          <Login
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <MyRequests
          setCurrentPage={setCurrentPage}
          setSelectedRequestId={setSelectedRequestId}
        />
      );
    }


    /* =========================
       TRACK REQUEST
    ========================= */

    if (currentPage === "trackRequest") {
      if (!isLoggedIn || role !== "USER") {
        return (
          <Login
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <TrackRequest
          requestId={selectedRequestId}
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       ENVIRONMENTAL IMPACT
    ========================= */

    if (currentPage === "environmentalImpact") {
      if (!isLoggedIn || role !== "USER") {
        return (
          <Login
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <EnvironmentalImpact
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       ADMIN DASHBOARD
    ========================= */

    if (currentPage === "admin") {
      if (!isLoggedIn || role !== "ADMIN") {
        return (
          <AdminLogin
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <AdminDashboard
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       ADMIN REQUESTS
    ========================= */

    if (currentPage === "adminRequests") {
      if (!isLoggedIn || role !== "ADMIN") {
        return (
          <AdminLogin
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <AdminRequests
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       ADMIN USERS
    ========================= */

    if (currentPage === "adminUsers") {
      if (!isLoggedIn || role !== "ADMIN") {
        return (
          <AdminLogin
            setCurrentPage={setCurrentPage}
          />
        );
      }

      return (
        <AdminUsers
          setCurrentPage={setCurrentPage}
        />
      );
    }


    /* =========================
       DEFAULT
    ========================= */

    return (
      <Home
        setCurrentPage={setCurrentPage}
      />
    );
  };


  return (
    <div className="app">

      <Navbar
        setCurrentPage={setCurrentPage}
      />

      <main>
        {renderPage()}
      </main>

      <Footer />

    </div>
  );
}

export default App;
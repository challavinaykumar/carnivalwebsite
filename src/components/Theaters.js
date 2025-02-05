import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Calendar } from "primereact/calendar";
import Modal from "react-bootstrap/Modal";
import Footer from "./Footer";
import Header from "./Header";
import { URLS } from "../Url";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import {
  faUser,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
function Theaters() {
  const [Theaters, setTheaters] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  console.log(selectedSlot);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [modalPop, setModalPop] = useState(false); // this is the modal for the specific 1.5 hours!
  console.log(modalPop);

  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(sessionStorage.getItem("date") || today);
  console.log(date);
  const [activeshow, setActiveshow] = useState([]);
  const [activeSlot, setActiveSlot] = useState(null); // Store the active slot's identifier

  // const check = date.toString().slice(0, 10);
  const dateString = date;

  const dateObject = new Date(dateString);

  const dd = dateObject.getDate().toString().padStart(2, "0");
  const mm = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = dateObject.getFullYear();

  const formattedDateString = `${yyyy}-${mm}-${dd}`;
  console.log(formattedDateString, "formattedDateString");

  const databyid = (data) => {
    // sessionStorage.clear();
    axios.post(URLS.GetUnicId, {}, {}).then((res) => {
      if (res.status === 200) {
        sessionStorage.setItem("UserId", res.data.userId);
        sessionStorage.setItem("theaterId", data._id);
        sessionStorage.setItem("theatreName", data.name);
        sessionStorage.setItem("theatrePrices", data.offerPrice);
        sessionStorage.setItem("date", formattedDateString);
        window.location.href = "/BookingDetails";
      }
    });
  };

  useEffect(() => {
    setDate(sessionStorage.getItem("date"));
    GetTheatersData();
    //sessionStorage.clear();
    sessionStorage.removeItem("bookingid");
    sessionStorage.removeItem("specialPersonName");
    sessionStorage.removeItem("TotalPrice");
    sessionStorage.removeItem("TotalPrice2");
    sessionStorage.removeItem("addons");
    sessionStorage.removeItem("addonsData");
    sessionStorage.removeItem("adonsJSON");
    sessionStorage.removeItem("userDetails");
    sessionStorage.removeItem("theaterName");
    sessionStorage.removeItem("theaterId");
    sessionStorage.removeItem("subtotal");
    sessionStorage.removeItem("slot");
    sessionStorage.removeItem("selectedOccasion");
    sessionStorage.removeItem("planType");
    sessionStorage.removeItem("paymentkey");
    sessionStorage.removeItem("orderId");
    sessionStorage.removeItem("occprice");
    sessionStorage.removeItem("occasionName");
    sessionStorage.removeItem("occasion");
    sessionStorage.removeItem("invoicePath");
    sessionStorage.removeItem("extraPersonprice");
    sessionStorage.removeItem("extraPersonperprice");
    sessionStorage.removeItem("extraAddedPersonsForTheatre");
    sessionStorage.removeItem("date");
    sessionStorage.removeItem("data");
    sessionStorage.removeItem("coupondis");
    sessionStorage.removeItem("cakeprice");
    sessionStorage.removeItem("advancePayment");
    sessionStorage.removeItem("countPeople");
    sessionStorage.removeItem("theaterPrice");
    sessionStorage.removeItem("theatrePrices");
    sessionStorage.removeItem("comboAdvancePayment");
    sessionStorage.removeItem("maxPeople");
  }, []);

  const GetTheatersData = () => {
    axios
      .post(
        URLS.GetAllTheaters,
        { slotDate: sessionStorage.getItem("date") || formattedDateString },
        {}
      )
      .then((res) => {
        if (res.status === 200) {
          setTheaters(res.data.theatres);
          setIsLoading(false);
        }
      });
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleView = () => {
    setIsExpanded(!isExpanded);
  };

  const [form, setform] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    description: "",
    eventName: "",
  });

  const [lgShow, setLgShow] = useState(false);

  const modelshow = () => {
    setLgShow(!false);
  };

  const formsubmit = (e) => {
    e.preventDefault();
    EnquiryNow();
  };

  const handleChange = (e) => {
    let myUser = { ...form };
    myUser[e.target.name] = e.target.value;

    setform(myUser);
  };

  const [isDisabled, setIsDisabled] = useState(false);

  const handleChanges = (e) => {
    const dateString = e.target.value;
    if (!dateString) {
      console.error("No date selected");
      return;
    }
    setDate(dateString);
    const dateObject = new Date(dateString);
    const dd = dateObject.getDate().toString().padStart(2, "0");
    const mm = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const yyyy = dateObject.getFullYear();

    const formattedDateString = `${yyyy}-${mm}-${dd}`;

    sessionStorage.setItem("date", formattedDateString);
    axios
      .post(URLS.GetAllTheaters, { slotDate: formattedDateString }, {})
      .then((res) => {
        if (res.status === 200) {
          setTheaters(res.data.theatres);
        }
      })
      .catch((error) => {
        console.error("Error fetching theaters:", error);
      });
  };

  const EnquiryNow = () => {
    const dataArray = {
      name: form.name,
      email: form.email,
      mobileNumber: form.mobileNumber,
      description: form.description,
      eventName: form.eventName,
    };

    axios.post(URLS.AddEnquiry, dataArray).then(
      (res) => {
        if (res.status === 200) {
          toast(res.data.message);
          setLgShow(false);
          setform({
            name: "",
            email: "",
            mobileNumber: "",
            description: "",
            eventName: "",
          });
        }
      },
      (error) => {
        if (error.response && error.response.status === 400) {
          toast(error.response.data.message);
        }
      }
    );
  };

  const [Contact, setContact] = useState([]);

  useEffect(() => {
    GetFooterData();
    sessionStorage.setItem("date", formattedDateString);
  }, []);

  const GetFooterData = () => {
    axios.post(URLS.GetFooter, {}, {}).then((res) => {
      if (res.status === 200) {
        setContact(res.data.contactus);
      }
    });
  };

  const cardHeaderStyle = {
    position: "relative",
    padding: "10px",
  };

  const naviagte = useNavigate();

  // const handleSlot = (e, data, index) => {
  //   e.preventDefault();
  //   if (!data.isBooked) {
  //     setSelectedSlot((prevState) => ({
  //       ...prevState,
  //       [index]: data,
  //     }));
  //   }

  //   console.log(data, "slot");
  //   setActiveshow(data);
  //   setActiveSlot(data); // Set the clicked slot as active
  //   sessionStorage.setItem("slot", data.fromTime + " - " + data.toTime);
  //   // sessionStorage.setItem("theaterName",data.name);
  //   // sessionStorage.setItem("theaterPrice",data.Price);
  //   // sessionStorage.setItem("TotalPrice",data.Price);
  //   // sessionStorage.setItem("planType","Basic");
  //   // naviagte("/Basicplan");
  // };

  const [nintymin, setnintymin] = useState(0);
  const convertTo12HourFormat = (time24) => {
    // Ensure the time24 is in the correct format
    const [hoursStr, minutes] = time24.split(":");
    const hours = parseInt(hoursStr, 10); // Convert hours to an integer
    const hours12 = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    const period = hours < 12 ? "AM" : "PM"; // Determine AM or PM
    return `${hours12}:${minutes.padStart(2, "0")} ${period}`; // Ensure minutes are always two digits
  };

  const handleSlot = (e, data, index) => {
    e.preventDefault();

    if (!data.isBooked) {
      setSelectedSlot((prevState) => ({
        ...prevState,
        [index]: data,
      }));
    }

    setActiveshow(data);
    setActiveSlot(data);

    const fromTime12 = convertTo12HourFormat(data.fromTime);
    const toTime12 = convertTo12HourFormat(data.toTime);

    sessionStorage.setItem("slot", `${fromTime12} - ${toTime12}`);

    const selectedValue = (
      e.target.value || `${fromTime12} / ${toTime12}`
    ).trim();
    console.log("Selected Value:", selectedValue);

    // Check if the selected slot is one and a half hours
    const durationInMinutes = calculateSlotDuration(data.fromTime, data.toTime);
    setnintymin(durationInMinutes || 0);
    sessionStorage.setItem("nintymin", durationInMinutes || 0);
    console.log(durationInMinutes);
    if (durationInMinutes === 90) {
      // 90 minutes = 1.5 hours
      setModalPop(true);
    }
  };

  // Utility function to calculate the duration of a slot in minutes
  const calculateSlotDuration = (fromTime, toTime) => {
    const fromDate = new Date(`1970-01-01T${fromTime}:00`);
    const toDate = new Date(`1970-01-01T${toTime}:00`);
    const durationInMilliseconds = toDate - fromDate;

    return durationInMilliseconds / (1000 * 60); // Convert to minutes
  };

  const handleclose = () => {
    setModalPop(false);
  };

  const handlePlanSelection = (plan, index) => {
    setSelectedPlan(plan);
    setSelectedPlan((prevState) => ({
      ...prevState,
      [index]: plan,
    }));
  };

  const handleBasicPlan = (data, i) => {
    console.log(data, "data");
    var price = nintymin == 90 ? data.oneandhalfslotPrice : data.offerPrice;
    sessionStorage.setItem("theaterId", data._id);
    sessionStorage.setItem("maxPeople", data.maxPeople);
    sessionStorage.setItem(
      "extraPersonprice",
      nintymin == 90
        ? data.onehalfanhourExtraPersonPrice || 0
        : data.extraPersonprice
    );
    sessionStorage.setItem("theaterName", data.name);
    sessionStorage.setItem("theatermaxSeating", data.maxSeating);

    sessionStorage.setItem("theaterPrice", price);
    sessionStorage.setItem("theatrePrices", price);
    sessionStorage.setItem("TotalPrice", price);
    sessionStorage.setItem("subtotal", price);

    sessionStorage.setItem("cartCakes", JSON.stringify([]));
    sessionStorage.setItem("selectedOccasion", JSON.stringify([]));
    sessionStorage.setItem("occprice", "0");
    sessionStorage.setItem("cakeprice", "0");
    sessionStorage.setItem("cartcakeslength", "500");
    sessionStorage.setItem("addons", "0");

    sessionStorage.setItem("coupondis", "0");
    sessionStorage.setItem("planType", selectedPlan[i]);
    if (selectedPlan[i] == "combo") {
      naviagte("/ComboForm");
    } else {
      naviagte("/Basicplan");
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Best Surprise Party Places in Hyderabad | Private Theater</title>
        <meta
          name="description"
          content="Celebrate at Carnival Castle Private Theatres in Hyderabad. Perfect for birthdays, anniversaries, & special events with custom decor, food & privacy. Book now!!"
        />
      </Helmet>

      {isLoading == true ? (
        <>
          <div
            className="text-center"
            style={{
              // background:
              //   "linear-gradient(329deg, rgba(191, 63, 249, 1) 0%, rgba(113, 51, 210, 1) 100%)",
              backgroundColor: "var(--charcoal-black)",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div>
              <img
                src="assets/img/gipss.gif"
                style={{ height: "300px", color: "white" }}
              ></img>
              <h6 style={{ color: "gold" }}>Loading...</h6>
            </div>
          </div>
        </>
      ) : (
        <>
          <div class="home-page indexsix">
            <Header />
            <main class="main-wrapper">
              <section
                id="parallax"
                className="slider-area breadcrumb-area d-flex align-items-center justify-content-center fix bg-dark border-gradient border-gradient-gold only-bottom-border"
                // style={{ backgroundImage: "url(img/bgss.jpg)" }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-xl-6 offset-xl-3 col-lg-8 offset-lg-2">
                      <div className="breadcrumb-wrap text-center">
                        <div className="breadcrumb-title mb-30">
                          <h1 style={{ color: "white", marginTop: "20px" }}>
                            Theaters
                          </h1>
                        </div>
                        {/* <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <a href="/">Home</a>
                            </li>
                            <li
                              className="breadcrumb-item active"
                              aria-current="page"
                            >
                              Theaters
                            </li>
                          </ol>
                        </nav> */}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="shop-area pt-5 pb-5 p-relative bg-dark"
                style={{ background: "#F8EBFF" }}
              >
                <div className="container-md">
                  <div className="row mb-3">
                    <div className="col-12">
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div className="text-center">
                          <label className="mb-2 servicesLink bright-all-links">
                            Check Slot Availability
                          </label>
                          <br></br>
                          {/* <Calendar
                            id="buttondisplay"
                            showIcon
                            placeholder="select date"
                            value={date}
                            onChange={(e) => handleChanges(e)}
                            minDate={today}
                          /> */}

                          <input
                            type="date"
                            id="buttondisplay"
                            name="theaterdate"
                            className={`form-control ${
                              isDisabled ? "bg-light" : ""
                            }`}
                            value={date}
                            defaultValue={
                              new Date().toISOString().split("T")[0]
                            }
                            onChange={handleChanges}
                            min={new Date().toISOString().split("T")[0]}
                            disabled={isDisabled}
                          />
                        </div>
                      </div>
                      <hr></hr>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-12">
                      <div className="row justify-content-center">
                        {/* <div className="col-lg-2 col-md-4 col-6 mb-2">
                          <a
                            className="btn main-booknow  w-100 text-black "
                            onClick={() => {
                              modelshow();
                            }}
                          >
                            <i className="fa fa-book"></i> Book Via Call
                            
                          </a>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 mb-2">
                          <a
                            className="btn main-booknow  w-100 text-black"
                            href={`https://api.whatsapp.com/send/?phone=+91${Contact.phone}&text=Hi&type=phone_number&app_absent=0`}

                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fab fa-whatsapp"></i> {Contact.phone}
                          </a>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  <hr></hr>

                  <div className="container">
                    <div className="row">
                      {Theaters.map((data, i) => {
                        const isComboBasicActive =
                          selectedSlot[i] !== undefined;
                        const isBookNowActive =
                          selectedSlot[i] !== undefined &&
                          selectedPlan[i] !== undefined;

                        return (
                          <div
                            className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
                            key={i}
                          >
                            <div
                              className="card rounded bg-light-grey text-white flex-fill"
                              style={{
                                minHeight: "820px", // Set a minimum height for uniformity
                                overflow: "hidden",
                                border: "2px solid white",
                              }}
                            >
                              <div style={cardHeaderStyle}>
                                <div
                                  className="course-img"
                                  data-label={data.batchType}
                                  id="ort"
                                  style={{ position: "relative" }}
                                >
                                  {/* <div
                                    id="orts"
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                    {hoveredIndex === i && data.video ? (
                                      <video
                                        src={URLS.Base + data.video}
                                        className="img-fluid rounded-top"
                                        id="theaters"
                                        style={{
                                          height: "250px",
                                          borderRadius: "10px",
                                          width: "100%",
                                          cursor: "pointer",
                                          display: "block",
                                          objectFit: "cover",
                                        }}
                                        autoPlay
                                        loop
                                        muted
                                      />
                                    ) : (
                                      <img
                                        src={URLS.Base + data.image}
                                        alt={data.name}
                                        className="img-fluid rounded-top"
                                        id="theaters"
                                        style={{
                                          height: "250px",
                                          borderRadius: "10px",
                                          width: "100%",
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                  </div> */}
                                  <div className="doc-img">
                                    <a
                                      // href="/Theaters"
                                      onMouseEnter={() => setHoveredIndex(i)}
                                      onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                      {/* when there is no video dispalying the same image in the the */}
                                      {data.video ? (
                                        <video
                                          src={URLS.Base + data.video}
                                          className="img-fluid video-mobile"
                                          id="theaters"
                                          style={{
                                            height: "250px", // Same height as image
                                            borderRadius: "10px",
                                            width: "100%", // Same width as image
                                            cursor: "pointer",
                                            display: "block",
                                            objectFit: "cover",
                                          }}
                                          autoPlay
                                          // controls
                                          loop
                                          muted
                                          preload="auto"
                                        />
                                      ) : (
                                        <img
                                          // src={URLS.Base + data.image[0]}
                                          src={URLS.Base + data.image}
                                          alt=""
                                          className="img-fluid video-theatres"
                                          id="theaters"
                                          style={{
                                            height: "250px", // Same height as video
                                            borderRadius: "10px",
                                            width: "100%", // Same width as video
                                            cursor: "pointer",
                                          }}
                                        />
                                      )}
                                      {data.video ? (
                                        <img
                                          // src={URLS.Base + data.image[0]}
                                          src={URLS.Base + data.image}
                                          alt=""
                                          className="img-fluid theatres"
                                          id="theaters"
                                          style={{
                                            height: "250px", // Same height as video
                                            borderRadius: "10px",
                                            width: "100%", // Same width as video
                                            cursor: "pointer",
                                          }}
                                        />
                                      ) : (
                                        <img
                                          // src={URLS.Base + data.image[0]}
                                          src={URLS.Base + data.image}
                                          alt=""
                                          className="img-fluid  vdeoimage"
                                          id="theaters"
                                          style={{
                                            height: "250px", // Same height as video
                                            borderRadius: "10px",
                                            width: "100%", // Same width as video
                                            cursor: "pointer",
                                          }}
                                        />
                                      )}
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5
                                      className="card-title m-0"
                                      style={{ fontSize: "1.05rem" }}
                                    >
                                      {data.name}
                                    </h5>
                                    <span
                                      className="badge bg-danger text-white"
                                      style={{ fontSize: "0.75rem" }}
                                    >
                                      {data.availableSlotsCount > 0
                                        ? `${data.availableSlotsCount} slots available`
                                        : "0 slots available"}
                                    </span>
                                  </div>
                                  <p
                                    className="card-price mb-2"
                                    style={{ fontSize: "0.875rem" }}
                                  >
                                    ₹ <del>{data.price}</del> {data.offerPrice}{" "}
                                    /-
                                  </p>
                                  <div className="row mb-2">
                                    <div className="col-6">
                                      <p
                                        className="card-details mb-2"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        <i className="bi bi-currency-exchange"></i>{" "}
                                        Extra Person Price:{" "}
                                        {data.extraPersonprice}
                                      </p>
                                    </div>
                                    <div className="col-6">
                                      <p
                                        className="card-details mb-2"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        <i className="bi bi-person"></i> Max
                                        People: {data.maxPeople}
                                      </p>
                                    </div>
                                  </div>
                                  <p
                                    className="card-details mb-2"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    <i className="bi bi-tv"></i> Features
                                    <ul style={{ paddingLeft: "1.5rem" }}>
                                      {isExpanded
                                        ? data.features.map(
                                            (feature, index) => (
                                              <li key={index}>{feature}</li>
                                            )
                                          )
                                        : data.features
                                            .slice(0, 3)
                                            .map((feature, index) => (
                                              <li key={index}>{feature}</li>
                                            ))}
                                      <span
                                        onClick={toggleView}
                                        style={{
                                          cursor: "pointer",
                                          color: "white",
                                          textDecoration: "underline",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        {isExpanded ? "View Less" : "View More"}
                                      </span>
                                    </ul>
                                  </p>
                                  <p
                                    className="card-details mb-2"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    <i className="bi bi-info-circle"></i>{" "}
                                    Description:{" "}
                                    {data.description
                                      .split(" ")
                                      .slice(0, 15)
                                      .join(" ")}
                                    {data.description.split(" ").length > 25 &&
                                      "..."}
                                  </p>
                                </div>
                                <div>
                                  <div className="slot-selection mb-3">
                                    <p
                                      className="slot-title mb-2"
                                      style={{ fontSize: "0.875rem" }}
                                    >
                                      Choose Your Slot:
                                    </p>
                                    <div className="row">
                                      {data.availableSlots.map(
                                        (slot, index) => {
                                          // Convert times to 12-hour format for display
                                          const fromTime12 =
                                            convertTo12HourFormat(
                                              slot.fromTime
                                            );
                                          const toTime12 =
                                            convertTo12HourFormat(slot.toTime);

                                          return (
                                            <div
                                              className="col-6 mb-2"
                                              key={index}
                                            >
                                              <button
                                                className={`btn w-100 ${
                                                  slot.isBooked
                                                    ? "btn-secondary"
                                                    : "btn text-dark"
                                                } ${
                                                  selectedSlot[i] === slot
                                                    ? "selectedbtns"
                                                    : "bg-white"
                                                }`}
                                                onClick={(e) =>
                                                  handleSlot(e, slot, i)
                                                }
                                                style={{
                                                  color: slot.isBooked
                                                    ? "black"
                                                    : "",
                                                  textDecoration: slot.isBooked
                                                    ? "line-through"
                                                    : "none",
                                                  fontSize: "0.8rem",
                                                  padding: "5px",
                                                }}
                                                disabled={slot.isBooked}
                                                value={`${fromTime12} / ${toTime12}`}
                                              >
                                                {fromTime12} - {toTime12}
                                              </button>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-6">
                                      <a
                                        onClick={() =>
                                          handlePlanSelection("combo", i)
                                        }
                                        className={`btn btn-outline-primary ${
                                          isComboBasicActive ? "" : "disabled"
                                        }`}
                                        style={{
                                          width: "100%",
                                          color: isComboBasicActive
                                            ? "black"
                                            : "black",
                                          backgroundColor:
                                            selectedPlan[i] === "combo"
                                              ? "#E9BE5F"
                                              : "white",
                                          border: "1px solid #E9BE5F",
                                          fontSize: "0.8rem",
                                        }}
                                        aria-disabled={!isComboBasicActive}
                                      >
                                        Combo
                                      </a>
                                    </div>
                                    <div className="col-6">
                                      <a
                                        onClick={() =>
                                          handlePlanSelection("normal", i)
                                        }
                                        className={`btn ${
                                          isComboBasicActive ? "" : "disabled"
                                        }`}
                                        style={{
                                          width: "100%",
                                          color: isComboBasicActive
                                            ? "black"
                                            : "black",
                                          backgroundColor:
                                            selectedPlan[i] === "normal"
                                              ? "#E9BE5F"
                                              : "white",
                                          border: "1px solid #E9BE5F",
                                          fontSize: "0.8rem",
                                        }}
                                        aria-disabled={!isComboBasicActive}
                                      >
                                        Basic
                                      </a>
                                    </div>
                                  </div>

                                  <div className="col-12 mt-3">
                                    <button
                                      disabled={!isBookNowActive}
                                      onClick={() => handleBasicPlan(data, i)}
                                      className="btn main-booknow"
                                      style={{
                                        width: "100%",
                                        color: "black",
                                        border: "none",
                                        boxShadow: "none",
                                      }}
                                    >
                                      Book Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </main>

            {/* this is the call information for */}
            <Modal
              size="md"
              show={lgShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header
                closeButton
                className="bg-light-grey gradient-border"
              >
                <Modal.Title
                  id="example-modal-sizes-title-lg gradient-border"
                  style={{ textAlign: "center" }}
                  className="text-gold-gradient"
                >
                  REQUEST CALLBACK
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark gradient-border">
                <div className="row justify-content-md-center">
                  <div className="col-lg-12 mt-40 gradient-border">
                    <div className="row">
                      <div className="col-lg-12">
                        <div class="booking-form align-items-center justify-content-center">
                          {/* <form
                            className="mt-4 mb-3"
                            onSubmit={(e) => {
                              formsubmit(e);
                            }}
                          >
                            <>
                              <div className="mb-4">
                                <input
                                  required
                                  type="text"
                                  name="name"
                                  placeholder="Enter Full Name"
                                  value={form.name}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  className="form-control "
                                />
                              </div>
                              <div className="mb-4">
                                <input
                                  required
                                  placeholder="Enter Mobile Number"
                                  type="text"
                                  name="mobileNumber"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  maxlength="10"
                                  minLength="10"
                                  pattern="[0-9]{10}"
                                  value={form.mobileNumber}
                                  onKeyPress={(e) => {
                             
                                    const charCode = e.which
                                      ? e.which
                                      : e.keyCode;
                                    if (charCode < 48 || charCode > 57) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className="form-control "
                                />
                              </div>
                              <div className="mb-4">
                                <input
                                  required
                                  type="email"
                                  name="email"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Email"
                                  value={form.email}
                                  className="form-control"
                                />
                              </div>
                              <div className="mb-4">
                                <input
                                  required
                                  type="text"
                                  name="description"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Description"
                                  value={form.description}
                                  className="form-control"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn course-btn mb-3 text-white"
                                style={{ float: "right" }}
                              >
                                Submit
                              </button>
                            </>
                          </form> */}
                          <form
                            className="mt-4 mb-3"
                            onSubmit={(e) => {
                              formsubmit(e);
                            }}
                          >
                            <>
                              <div className="section-title text-center">
                                <h2 className="title">Enquiry Now</h2>
                                <hr className="gradient-border"></hr>
                              </div>
                              <div className="mb-3 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faUser} />
                                </span>
                                <input
                                  required
                                  type="text"
                                  name="name"
                                  placeholder="Enter Full Name*"
                                  value={form.name}
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  className="form-control "
                                />
                              </div>

                              <div className="mb-3 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faPhone} />
                                </span>
                                <input
                                  required
                                  placeholder="Enter Mobile Number*"
                                  type="text"
                                  name="mobileNumber"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  maxlength="10"
                                  minLength="10"
                                  pattern="[0-9]{10}"
                                  value={form.mobileNumber}
                                  onKeyPress={(e) => {
                                    const charCode = e.which
                                      ? e.which
                                      : e.keyCode;
                                    if (charCode < 48 || charCode > 57) {
                                      e.preventDefault();
                                    }
                                  }}
                                  className="form-control "
                                />
                              </div>

                              <div className="mb-3 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <input
                                  required
                                  type="email"
                                  name="email"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Email*"
                                  value={form.email}
                                  className="form-control"
                                />
                              </div>

                              <div className="mb-3 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                </span>
                                <input
                                  required
                                  type="text"
                                  name="description"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  placeholder="Enter Description*"
                                  value={form.description}
                                  className="form-control"
                                />
                              </div>

                              <div className="mb-3 input-group">
                                <span className="input-group-text">
                                  <FontAwesomeIcon icon={faCalendarAlt} />
                                </span>
                                <input
                                  required
                                  type="text"
                                  name="eventName"
                                  placeholder="Enter Event Name*"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  value={form.eventName}
                                  className="form-control"
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn main-booknow mb-3 float-end"
                              >
                                Submit
                              </button>
                            </>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            {/* this is the 1.5 hour pooup */}
            <Modal
              size="md"
              show={modalPop}
              onHide={() => setModalPop(false)}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header
                closeButton
                className=" gradient-border bg-light-grey"
              >
                <Modal.Title
                  id="example-modal-sizes-title-lg gradient-border"
                  style={{ textAlign: "center" }}
                >
                  <span className="text-gold-gradient"> Note : </span>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark gradient-border">
                <div className="row justify-content-md-center text-white">
                  <div className="col-lg-12 mt-40 gradient-border bg-dark">
                    <h6 className="p-4 text-center">
                      You have selected a slot with 1.5 hours duration and will
                      be charged accordingly. Proceed further if you are okay
                      with it!
                    </h6>
                    <div className="text-center">
                      <button
                        onClick={() => handleclose()}
                        type="button"
                        className="btn course-btn mb-4 text-center btn-outline text-white"
                      >
                        okay !
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>

            <ToastContainer />
            <Footer />
          </div>
        </>
      )}
    </>
  );
}

export default Theaters;

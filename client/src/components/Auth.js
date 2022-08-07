import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import signinImage from "../assets/signup.jpeg";
import Typewriter from "typewriter-effect";

const cookies = new Cookies();

const initialState = {
  fullName: "",
  username: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  avatarURL: "",
};

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, phoneNumber, avatarURL } = form;
    const URL = "http://localhost:5003/auth";

    // we are sending the form data to the server and destructing the response and storing in data object
    const {
      data: { token, userId, hashedPassword, fullName },
    } = await axios.post(`${URL}${isSignup ? "/signup" : "/login"}`, {
      username,
      password,
      fullName: form.fullName,
      phoneNumber,
      avatarURL,
    });

    cookies.set("token", token);
    cookies.set("username", username);
    cookies.set("fullName", fullName);
    cookies.set("userId", userId);

    if (isSignup) {
      cookies.set("phoneNumber", phoneNumber);
      cookies.set("avatarURL", avatarURL);
      cookies.set("hashedPassword", hashedPassword);
    }

    window.location.reload();
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_image">
        <div className="auth__form-contianer-typed">
          <div className="auth__form-Logo">
            <div class="logo-holder ">
              <span>
                <i class="fa-solid fa-bell"></i>
              </span>
              <h1>Medicord</h1>
            </div>
          </div>
          <div className="auth__form-contianer-typed_main">
            <h1>
              Hi! I am Medicord, you can use me for
              <span className="changeingText">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString("Consulting With Doctors")
                      .pauseFor(1000)
                      .deleteAll()
                      .typeString("Creating Channels")
                      .pauseFor(1000)
                      .deleteAll()
                      .typeString("Creating Direct Messaging Groups")
                      .pauseFor(1000)
                      .deleteAll()
                      .typeString("I can even send emojis")
                      .pauseFor(1000)
                      .deleteAll()
                      .start();
                  }}
                />
              </span>
            </h1>
          </div>
        </div>
        <img src={signinImage} alt="sign in" />
      </div>

      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignup ? "Sign Up" : "Sign In"}</p>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="fullName">Full Name</label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="username">Username</label>
              <input
                name="username"
                type="text"
                placeholder={isSignup ? "Username" : "Code_monk#1565"}
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatarURL">Avatar URL</label>
                <input
                  name="avatarURL"
                  type="text"
                  placeholder="Avatar URL"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder={isSignup ? "Password" : "Codemonk#1565"}
                onChange={handleChange}
                required
              />
            </div>
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth__form-container_fields-content_button">
              <button>{isSignup ? "Sign Up" : "Sign In"}</button>
            </div>
          </form>
          <div className="auth__form-container_fields-account">
            <p>
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
              <span style={{ color: " #c8cacd" }} onClick={switchMode}>
                {isSignup ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

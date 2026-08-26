"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.interest ||
      !form.message
    ) {
      return toast.error("Please fill all fields.");
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(form.phone)) {
      return toast.error("Please enter a valid phone number.");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      toast.success(
        "Thank you! We'll contact you shortly."
      );

      setForm({
        name: "",
        phone: "",
        email: "",
        interest: "",
        message: "",
      });
    } catch (err) {
      toast.error(
        err.message || "Failed to submit enquiry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-[#F8F5EF]">

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* MAIN GRID */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-[1fr_560px]
          gap-14
          xl:gap-20
          items-start
        ">

          {/* =====================================================
              LEFT SECTION
          ===================================================== */}

          <div className="max-w-[520px]">

            <p className="
              uppercase
              tracking-[4px]
              text-[11px]
              font-semibold
              text-[#C89B4F]
            ">
              Get In Touch
            </p>

            <h2 className="
              mt-5
              font-playfair
              text-[40px]
              sm:text-[44px]
              lg:text-[46px]
              leading-[1.15]
              text-[#222]
            ">
              Let's Find the Right
              <br />
              Property for You
            </h2>

            <div className="
              w-14
              h-[2px]
              bg-[#C89B4F]
              mt-7
              mb-7
            " />

            <p className="
              text-[#666]
              text-[15px]
              leading-8
              max-w-[420px]
            ">
              Whether you're looking to invest,
              buy or explore premium
              opportunities, our team is ready
              to assist you.
            </p>

            {/* CONTACT INFO */}

            <div className="mt-12 space-y-6">

              <InfoCard
                icon={<Phone size={18} />}
                title="Phone"
                value="+91 9090 106 101"
              />

              <InfoCard
                icon={<Mail size={18} />}
                title="Email"
                value="connect@propertybouquet.com"
              />

              <InfoCard
                icon={<MapPin size={18} />}
                title="Our Office"
                value="Suncity Success Tower, Golf Course Extension Road, Sector 65, Gurugram"
              />

              <InfoCard
                icon={<Clock3 size={18} />}
                title="Working Hours"
                value={
                  <>
                    Mon – Sat : 10:00 AM – 7:00 PM
                    <br />
                    Sunday : By Appointment Only
                  </>
                }
              />

            </div>

          </div>


          {/* =====================================================
              RIGHT FORM
          ===================================================== */}

          <div className="
            w-full
            max-w-[560px]
            justify-self-end
            rounded-[22px]
            bg-[#041E19]
            border
            border-[#1A493D]
            p-7
            sm:p-8
            shadow-[0_20px_60px_rgba(0,0,0,.15)]
          ">

            <p className="
              uppercase
              tracking-[4px]
              text-[10px]
              font-semibold
              text-[#C89B4F]
            ">
              Send Us A Message
            </p>

            <div className="
              w-12
              h-[2px]
              bg-[#C89B4F]
              mt-4
              mb-6
            " />

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME + PHONE */}

              <div className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-3
              ">

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="luxuryInput"
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="luxuryInput"
                />

              </div>


              {/* EMAIL */}

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="luxuryInput"
              />


              {/* INTEREST */}

              <select
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="luxuryInput text-white"
              >

                <option
                  value=""
                  className="text-black bg-white"
                >
                  I'm Interested In
                </option>

                <option
                  value="Buying Property"
                  className="text-black bg-white"
                >
                  Buying Property
                </option>

                <option
                  value="Luxury Apartment"
                  className="text-black bg-white"
                >
                  Luxury Apartment
                </option>

                <option
                  value="Investment"
                  className="text-black bg-white"
                >
                  Investment
                </option>

                <option
                  value="Commercial"
                  className="text-black bg-white"
                >
                  Commercial
                </option>

              </select>


              {/* MESSAGE */}

              <textarea
                rows={4}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="luxuryInput resize-none"
              />


              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  mt-1
                  h-[48px]
                  px-7
                  rounded-md
                  bg-[#D7AF67]
                  text-[#111]
                  font-semibold
                  text-[13px]
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  hover:bg-[#E2BC79]
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Sending...
                  </>
                ) : (
                  <>
                    Send Message

                    <ArrowRight
                      size={16}
                      className="
                        group-hover:translate-x-1
                        transition
                      "
                    />
                  </>
                )}

              </button>


              {/* SECURITY NOTE */}

              <div className="
                flex
                items-center
                gap-2
                pt-1
                text-white/55
                text-[12px]
              ">

                <Lock
                  size={14}
                  className="text-[#C89B4F] shrink-0"
                />

                <span>
                  Your information is 100% safe and secure with us.
                </span>

              </div>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ===============================================================
   INFO CARD
=============================================================== */

function InfoCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="flex items-start gap-4">

      <div
        className="
          w-[50px]
          h-[50px]
          rounded-full
          bg-[#041E19]
          text-[#C89B4F]
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="
          text-[#888]
          text-[13px]
        ">
          {title}
        </p>

        <div className="
          mt-1
          text-[#222]
          text-[15px]
          leading-7
        ">
          {value}
        </div>

      </div>

    </div>
  );
}
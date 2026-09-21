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

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     HANDLE SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.interest.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(form.phone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          interest: form.interest,
          message: form.message.trim(),
        }),
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(
          data?.message || "Something went wrong."
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
        err?.message || "Failed to submit enquiry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        w-full
        py-20
        sm:py-24
        bg-[#F8F5EF]
      "
    >
      <div
        className="
          w-full
          max-w-[1400px]
          mx-auto
          px-5
          sm:px-8
          lg:px-14
          xl:px-16
        "
      >
        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div
          className="
            w-full
            grid
            grid-cols-1
            lg:grid-cols-[minmax(0,1fr)_560px]
            gap-12
            xl:gap-20
            items-start
          "
        >
          {/* ===================================================
              LEFT CONTENT
          =================================================== */}

          <div
            className="
              w-full
              max-w-[560px]
            "
          >
            {/* EYEBROW */}

            <p
              className="
                m-0
                uppercase
                tracking-[4px]
                text-[11px]
                font-semibold
                text-[#C89B4F]
              "
            >
              Get In Touch
            </p>

            {/* HEADING */}

            <h2
              className="
                m-0
                mt-5
                font-playfair
                font-normal
                text-[40px]
                sm:text-[44px]
                lg:text-[46px]
                leading-[1.12]
                tracking-[-0.5px]
                text-[#222222]
              "
            >
              Let's Find the Right
              <br />
              Property for You
            </h2>

            {/* GOLD DIVIDER */}

            <div
              className="
                w-14
                h-[2px]
                mt-7
                mb-7
                bg-[#C89B4F]
              "
            />

            {/* DESCRIPTION */}

            <p
              className="
                m-0
                max-w-[460px]
                text-[#666666]
                text-[15px]
                leading-[1.9]
              "
            >
              Whether you're looking to invest, buy or explore
              premium opportunities, our team is ready to assist
              you.
            </p>

            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <div
              className="
                mt-11
                flex
                flex-col
                gap-6
              "
            >
              <InfoCard
                icon={<Phone size={18} strokeWidth={1.8} />}
                title="Phone"
                value="+91 9090 106 101"
              />

              <InfoCard
                icon={<Mail size={18} strokeWidth={1.8} />}
                title="Email"
                value="connect@propertybouquet.com"
              />

              <InfoCard
                icon={<MapPin size={18} strokeWidth={1.8} />}
                title="Our Office"
                value={
                  <>
                    Suncity Success Tower, Golf Course Extension
                    Road, Sector 65, Gurugram
                  </>
                }
              />

              <InfoCard
                icon={<Clock3 size={18} strokeWidth={1.8} />}
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

          {/* ===================================================
              RIGHT CONTACT FORM
          =================================================== */}

          <div
            className="
              w-full
              max-w-[560px]
              lg:justify-self-end
              rounded-[24px]
              bg-[#041E19]
              border
              border-[#1A493D]
              p-6
              sm:p-7
              lg:p-8
              shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              box-border
              overflow-hidden
            "
          >
            {/* FORM HEADING */}

            <p
              className="
                m-0
                uppercase
                tracking-[4px]
                text-[10px]
                font-semibold
                text-[#C89B4F]
              "
            >
              Send Us A Message
            </p>

            <div
              className="
                w-11
                h-[2px]
                bg-[#C89B4F]
                mt-4
                mb-6
              "
            />

            {/* =================================================
                FORM

                IMPORTANT:
                Explicitly force flex column so global CSS
                cannot turn this into a grid/flex row.
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="
                !w-full
                !max-w-none
                !min-w-0
                !m-0
                !p-0
                !flex
                !flex-col
                !gap-4
                box-border
              "
            >
              {/* =================================================
                  NAME + PHONE
              ================================================= */}

              <div
                className="
                  !w-full
                  !min-w-0
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-3
                  box-border
                "
              >
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  autoComplete="name"
                  className="
                    !block
                    !w-full
                    !min-w-0
                    !max-w-none
                    !h-[46px]
                    !m-0
                    !px-4
                    !py-0
                    !rounded-[4px]
                    !border
                    !border-white
                    !bg-white
                    !text-[#222222]
                    !text-[14px]
                    !leading-none
                    !outline-none
                    !box-border
                    placeholder:!text-[#8B8FA0]
                    focus:!border-[#D7AF67]
                    focus:!ring-1
                    focus:!ring-[#D7AF67]
                  "
                />

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className="
                    !block
                    !w-full
                    !min-w-0
                    !max-w-none
                    !h-[46px]
                    !m-0
                    !px-4
                    !py-0
                    !rounded-[4px]
                    !border
                    !border-white
                    !bg-white
                    !text-[#222222]
                    !text-[14px]
                    !leading-none
                    !outline-none
                    !box-border
                    placeholder:!text-[#8B8FA0]
                    focus:!border-[#D7AF67]
                    focus:!ring-1
                    focus:!ring-[#D7AF67]
                  "
                />
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                autoComplete="email"
                className="
                  !block
                  !w-full
                  !min-w-0
                  !max-w-none
                  !h-[46px]
                  !m-0
                  !px-4
                  !py-0
                  !rounded-[4px]
                  !border
                  !border-white
                  !bg-white
                  !text-[#222222]
                  !text-[14px]
                  !leading-none
                  !outline-none
                  !box-border
                  placeholder:!text-[#8B8FA0]
                  focus:!border-[#D7AF67]
                  focus:!ring-1
                  focus:!ring-[#D7AF67]
                "
              />

              {/* =================================================
                  INTEREST
              ================================================= */}

              <select
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="
                  !block
                  !w-full
                  !min-w-0
                  !max-w-none
                  !h-[46px]
                  !m-0
                  !px-4
                  !py-0
                  !rounded-[4px]
                  !border
                  !border-white
                  !bg-white
                  !text-[#222222]
                  !text-[14px]
                  !outline-none
                  !box-border
                  focus:!border-[#D7AF67]
                  focus:!ring-1
                  focus:!ring-[#D7AF67]
                "
              >
                <option
                  value=""
                  className="text-[#8B8FA0] bg-white"
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

              {/* =================================================
                  MESSAGE
              ================================================= */}

              <textarea
                rows={5}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="
                  !block
                  !w-full
                  !min-w-0
                  !max-w-none
                  !h-[120px]
                  !min-h-[120px]
                  !m-0
                  !px-4
                  !py-3
                  !rounded-[4px]
                  !border
                  !border-white
                  !bg-white
                  !text-[#222222]
                  !text-[14px]
                  !leading-6
                  !outline-none
                  !box-border
                  !resize-none
                  placeholder:!text-[#8B8FA0]
                  focus:!border-[#D7AF67]
                  focus:!ring-1
                  focus:!ring-[#D7AF67]
                "
              />

              {/* =================================================
                  BUTTON
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  !inline-flex
                  !w-fit
                  !min-w-[205px]
                  !h-[48px]
                  !m-0
                  !px-7
                  !py-0
                  !rounded-[5px]
                  !border-0
                  !bg-[#D7AF67]
                  !text-[#111111]
                  !text-[13px]
                  !font-semibold
                  !leading-none
                  !items-center
                  !justify-center
                  !gap-3
                  !cursor-pointer
                  !box-border
                  hover:!bg-[#E2BC79]
                  transition-all
                  duration-300
                  disabled:!opacity-60
                  disabled:!cursor-not-allowed
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>

                    <ArrowRight
                      size={16}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>

              {/* =================================================
                  SECURITY NOTE
              ================================================= */}

              <div
                className="
                  !w-full
                  !min-w-0
                  !m-0
                  !p-0
                  flex
                  items-start
                  gap-2
                  text-white/55
                  text-[12px]
                  leading-5
                "
              >
                <Lock
                  size={14}
                  className="
                    text-[#C89B4F]
                    shrink-0
                    mt-[2px]
                  "
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

function InfoCard({ icon, title, value }) {
  return (
    <div
      className="
        w-full
        flex
        items-start
        gap-4
      "
    >
      {/* ICON */}

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

      {/* CONTENT */}

      <div
        className="
          min-w-0
          flex-1
          pt-[1px]
        "
      >
        <p
          className="
            m-0
            text-[#888888]
            text-[13px]
            leading-5
          "
        >
          {title}
        </p>

        <div
          className="
            mt-1
            text-[#222222]
            text-[15px]
            leading-7
            break-words
          "
        >
          {value}
        </div>
      </div>
    </div>
  );
}
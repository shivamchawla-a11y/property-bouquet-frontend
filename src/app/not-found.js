import Link from "next/link";
import {
  ArrowRight,
  Search,
  Home,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import styles from "./not-found.module.css";

export const metadata = {
  title: "Page Not Found | Property Bouquet",
  description:
    "The page you're looking for could not be found. Explore luxury properties and investment opportunities with Property Bouquet.",
};

export default function NotFound() {
  return (
    <div className={styles.site}>
      {/* =========================================================
          EXISTING PROPERTY BOUQUET NAVBAR
      ========================================================= */}
      <Navbar />

      {/* =========================================================
          404 PAGE
      ========================================================= */}
      <main className={styles.page}>
        {/* =======================================================
            BACKGROUND / ARCHITECTURAL ELEMENTS
        ======================================================= */}
        <div
          className={styles.background}
          aria-hidden="true"
        >
          {/* Ambient glow */}
          <div className={styles.backgroundGlow} />

          {/* Fine architectural grid */}
          <div className={styles.grid} />

          {/* Large architectural circles */}
          <div
            className={`${styles.orbit} ${styles.orbitOne}`}
          />

          <div
            className={`${styles.orbit} ${styles.orbitTwo}`}
          />

          {/* =====================================================
              ABSTRACT BUILDINGS
          ===================================================== */}
          <div className={styles.architecture}>
            {/* BUILDING ONE */}
            <div
              className={`${styles.tower} ${styles.towerOne}`}
            >
              <div className={styles.towerTop} />

              <div className={styles.windows}>
                {Array.from({ length: 28 }).map(
                  (_, index) => (
                    <span key={index} />
                  )
                )}
              </div>
            </div>

            {/* BUILDING TWO */}
            <div
              className={`${styles.tower} ${styles.towerTwo}`}
            >
              <div className={styles.towerTop} />

              <div className={styles.windows}>
                {Array.from({ length: 36 }).map(
                  (_, index) => (
                    <span key={index} />
                  )
                )}
              </div>
            </div>

            {/* CENTRAL BUILDING */}
            <div
              className={`${styles.tower} ${styles.towerThree}`}
            >
              <div className={styles.towerTop} />

              <div className={styles.windows}>
                {Array.from({ length: 20 }).map(
                  (_, index) => (
                    <span key={index} />
                  )
                )}
              </div>
            </div>

            <div className={styles.groundLine} />
          </div>

          {/* Vertical architectural lines */}
          <div
            className={`${styles.verticalLine} ${styles.leftLine}`}
          />

          <div
            className={`${styles.verticalLine} ${styles.rightLine}`}
          />

          {/* Page number */}
          <div className={styles.cornerText}>
            PB / 404
          </div>
        </div>

        {/* =======================================================
            MAIN CONTENT
        ======================================================= */}
        <section className={styles.hero}>
          {/* =====================================================
              BRAND LABEL
          ===================================================== */}
          <div className={styles.brandLabel}>
            <span className={styles.brandLine} />

            <span>PROPERTY BOUQUET</span>

            <span className={styles.brandLine} />
          </div>

          {/* =====================================================
              404 NUMBER
          ===================================================== */}
          <div
            className={styles.errorNumber}
            aria-label="Error 404"
          >
            <span className={styles.four}>
              4
            </span>

            <span
              className={styles.zero}
              aria-hidden="true"
            >
              <span>0</span>
            </span>

            <span className={styles.four}>
              4
            </span>
          </div>

          {/* =====================================================
              GOLD DIVIDER
          ===================================================== */}
          <div
            className={styles.divider}
            aria-hidden="true"
          >
            <span />

            <i />

            <span />
          </div>

          {/* =====================================================
              TEXT CONTENT
          ===================================================== */}
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              PAGE NOT FOUND
            </p>

            <h1>
              Not every journey
              <br />
              <em>leads where expected.</em>
            </h1>

            <p className={styles.description}>
              The page you were looking for may have moved,
              changed its address, or no longer exists.
              Let us help you find your way back to something
              worth discovering.
            </p>
          </div>

          {/* =====================================================
              PRIMARY ACTIONS
          ===================================================== */}
          <div className={styles.actions}>
            {/* HOME */}
            <Link
              href="/"
              className={styles.primaryButton}
            >
              <Home
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                Return Home
              </span>
            </Link>

            {/* PROPERTIES */}
            <Link
              href="/properties"
              className={styles.secondaryButton}
            >
              <span>
                Explore Properties
              </span>

              <ArrowRight
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* =====================================================
              PROPERTY DISCOVERY
          ===================================================== */}
          <div className={styles.discovery}>
            <div className={styles.discoveryIcon}>
              <Search
                size={15}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </div>

            <div className={styles.discoveryText}>
              <span>
                Looking for your next address?
              </span>

              <Link href="/properties">
                <span>
                  Discover curated properties
                </span>

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* =====================================================
              BRAND SIGNATURE
          ===================================================== */}
          <div className={styles.signature}>
            <span>
              CURATED
            </span>

            <i />

            <span>
              CONSIDERED
            </span>

            <i />

            <span>
              COLLECTED
            </span>
          </div>
        </section>

        {/* =======================================================
            BOTTOM META
        ======================================================= */}
        <div className={styles.bottomMeta}>
          <span>
            LUXURY REAL ESTATE
          </span>

          <span className={styles.bottomCenter}>
            <span className={styles.bottomDot} />

            INDIA

            <span className={styles.bottomDot} />
          </span>

          <span>
            ELEVATED LIVING
          </span>
        </div>
      </main>

      {/* =========================================================
          EXISTING PROPERTY BOUQUET FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}
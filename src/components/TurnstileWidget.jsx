"use client";

import { useEffect, useRef, useState } from "react";

// Turnstile Site Key is public and is safe to include in frontend code.
const TURNSTILE_SITE_KEY = "0x4AAAAAAF9yAcSzaX87YmUI";

let turnstileScriptPromise = null;

function loadTurnstileScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Turnstile can only load in the browser."));
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.propertyBouquetTurnstile = "true";

    script.onload = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
      } else {
        turnstileScriptPromise = null;
        reject(new Error("Cloudflare Turnstile did not initialize."));
      }
    };

    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error("Unable to load Cloudflare Turnstile."));
    };

    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

export default function TurnstileWidget({ onVerify }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onVerifyRef = useRef(onVerify);
  const [widgetError, setWidgetError] = useState("");

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let observer;

    const renderWidget = async () => {
      try {
        const turnstile = await loadTurnstileScript();
        if (cancelled || !container.isConnected || widgetIdRef.current !== null) {
          return;
        }

        widgetIdRef.current = turnstile.render(container, {
          sitekey: TURNSTILE_SITE_KEY,
          action: "newsletter_subscribe",
          theme: "dark",
          size: "normal",
          callback: (token) => {
            setWidgetError("");
            onVerifyRef.current?.(token);
          },
          "expired-callback": () => {
            onVerifyRef.current?.("");
            setWidgetError("Verification expired. Please complete it again.");
          },
          "error-callback": () => {
            onVerifyRef.current?.("");
            setWidgetError("Security verification could not be completed. Please refresh the page and try again.");
          },
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Turnstile widget error:", error);
          onVerifyRef.current?.("");
          setWidgetError("Security verification could not load. Please refresh the page and try again.");
        }
      }
    };

    // Load Cloudflare's script only when this widget approaches the viewport.
    if (typeof IntersectionObserver === "undefined") {
      renderWidget();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            renderWidget();
          }
        },
        { rootMargin: "200px 0px" }
      );
      observer.observe(container);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();

      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-[65px]" aria-label="Security verification">
      <div ref={containerRef} />
      {widgetError && (
        <p className="mt-1 text-[11px] leading-5 text-amber-300" role="status">
          {widgetError}
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { isIosDevice, isStandaloneMode } from "@/lib/pwa";

const IOS_DISMISS_KEY = "iasv-quiz-install-dismissed-ios";
const ANDROID_DISMISS_KEY = "iasv-quiz-install-dismissed-android";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaPrompts() {
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [showAndroidInstall, setShowAndroidInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) =>
            Promise.all(registrations.map((registration) => registration.unregister())),
          )
          .catch(() => undefined);
      }
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (localStorage.getItem(ANDROID_DISMISS_KEY) !== "1") {
        setShowAndroidInstall(true);
      }
    };

    const onControllerChange = () => {
      window.location.reload();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    let registration: ServiceWorkerRegistration | undefined;

    const watchWaiting = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShowUpdate(true);
      }
    };

    const onUpdateFound = () => {
      const installing = registration?.installing;
      if (!installing) {
        return;
      }
      installing.addEventListener("statechange", () => {
        if (
          installing.state === "installed" &&
          navigator.serviceWorker.controller &&
          registration?.waiting
        ) {
          setWaitingWorker(registration.waiting);
          setShowUpdate(true);
        }
      });
    };

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;
        watchWaiting(reg);
        reg.addEventListener("updatefound", onUpdateFound);

        if (!isStandaloneMode()) {
          if (isIosDevice() && localStorage.getItem(IOS_DISMISS_KEY) !== "1") {
            setShowIosInstall(true);
          }
        }
      })
      .catch(() => undefined);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      registration?.removeEventListener("updatefound", onUpdateFound);
    };
  }, []);

  const dismissIos = () => {
    localStorage.setItem(IOS_DISMISS_KEY, "1");
    setShowIosInstall(false);
  };

  const dismissAndroid = () => {
    localStorage.setItem(ANDROID_DISMISS_KEY, "1");
    setShowAndroidInstall(false);
    setDeferredPrompt(null);
  };

  const installAndroid = async () => {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowAndroidInstall(false);
    if (outcome === "accepted") {
      localStorage.setItem(ANDROID_DISMISS_KEY, "1");
    }
  };

  const applyUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      return;
    }
    window.location.reload();
  };

  if (!showIosInstall && !showAndroidInstall && !showUpdate) {
    return null;
  }

  return (
    <div className="pwa-stack" role="region" aria-label="App-meldingen">
      {showIosInstall && (
        <section className="pwa-banner pwa-banner-ios">
          <div className="pwa-banner-body">
            <p className="pwa-kicker">iPhone / iPad</p>
            <p className="pwa-title">Installeer iASV Quiz</p>
            <ol className="pwa-steps">
              <li>
                Tik op <strong>Delen</strong> (vierkant met pijl omhoog) in Safari
              </li>
              <li>
                Kies <strong>Zet op beginscherm</strong>
              </li>
              <li>
                Tik op <strong>Voeg toe</strong>
              </li>
            </ol>
          </div>
          <div className="pwa-actions">
            <button type="button" className="pwa-btn-secondary" onClick={dismissIos}>
              Later
            </button>
          </div>
        </section>
      )}

      {showAndroidInstall && (
        <section className="pwa-banner pwa-banner-android">
          <div className="pwa-banner-body">
            <p className="pwa-kicker">Android</p>
            <p className="pwa-title">Installeer iASV Quiz</p>
            <p className="pwa-text">
              Voeg de quiz toe aan je startscherm voor sneller openen en volledig scherm.
            </p>
          </div>
          <div className="pwa-actions">
            <button type="button" className="pwa-btn-primary" onClick={installAndroid}>
              Installeren
            </button>
            <button type="button" className="pwa-btn-secondary" onClick={dismissAndroid}>
              Later
            </button>
          </div>
        </section>
      )}

      {showUpdate && (
        <section className="pwa-banner pwa-banner-update">
          <div className="pwa-banner-body">
            <p className="pwa-kicker">Update</p>
            <p className="pwa-title">Nieuwe versie beschikbaar</p>
            <p className="pwa-text">
              Er staat een update klaar. Vernieuw om de nieuwste quizversie te gebruiken.
            </p>
          </div>
          <div className="pwa-actions">
            <button type="button" className="pwa-btn-primary" onClick={applyUpdate}>
              Nu bijwerken
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

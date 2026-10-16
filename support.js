(function () {
  const siteKey = "6Ld5NZotAAAAALy8dBr299qYvOjR_Dq6cXqxXVig";
  const form = document.getElementById("supportFeedbackForm");
  const status = document.getElementById("supportFormStatus");
  if (!form || !status) return;

  // reCAPTCHA (Google) loads only once the visitor starts using the form.
  let recaptchaLoad = null;
  function loadRecaptcha() {
    if (window.grecaptcha) return Promise.resolve();
    if (!recaptchaLoad) {
      recaptchaLoad = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          recaptchaLoad = null;
          reject(new Error("Captcha could not load. Disable blockers for this page or email us."));
        };
        document.head.append(script);
      });
    }
    return recaptchaLoad;
  }

  form.addEventListener("focusin", () => loadRecaptcha().catch(() => {}), { once: true });

  function setStatus(message, kind) {
    status.textContent = message;
    status.dataset.kind = kind;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    setStatus("Sending...", "sending");

    try {
      await loadRecaptcha();
      const token = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Captcha timed out. Try again or email us.")), 15000);
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action: "support_feedback" }).then(
            (value) => { clearTimeout(timeout); resolve(value); },
            () => { clearTimeout(timeout); reject(new Error("Captcha failed. Try again or email us.")); }
          );
        });
      });
      const response = await fetch("https://api.bloomary.life/api/support/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || ""),
          title: String(data.get("title") || ""),
          message: String(data.get("message") || ""),
          recaptchaResponse: token
        })
      });
      if (!response.ok) throw new Error("Feedback was not sent.");
      form.reset();
      setStatus("Thank you. Your message has been sent.", "success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Feedback was not sent.", "error");
    }
  });
})();

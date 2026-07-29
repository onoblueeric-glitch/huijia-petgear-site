(() => {
  "use strict";
  const config = window.HUIJIA_SITE_CONFIG || {};
  const menu = document.getElementById("mainNav");
  const mobileToggle = document.getElementById("mobileToggle");
  const modal = document.getElementById("quoteModal");
  const modalClose = document.getElementById("modalClose");

  if (mobileToggle && menu) {
    mobileToggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!modal) return;
      modal.classList.add("active");
      modal.querySelector("input")?.focus();
    });
  });
  modalClose?.addEventListener("click", () => modal?.classList.remove("active"));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("active");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") modal?.classList.remove("active");
  });

  document.querySelectorAll("[data-company-email]").forEach((el) => {
    el.textContent = config.email || "sales@yourdomain.com";
    el.href = `mailto:${config.email || "sales@yourdomain.com"}`;
  });
  document.querySelectorAll("[data-company-whatsapp]").forEach((el) => {
    if (!config.whatsappNumber) {
      el.closest("div")?.remove();
      return;
    }
    el.textContent = config.whatsappDisplay || config.whatsappNumber;
    el.href = `https://wa.me/${config.whatsappNumber}`;
  });
  document.querySelectorAll("[data-whatsapp-button]").forEach((el) => {
    if (!config.whatsappNumber) {
      el.hidden = true;
      return;
    }
    el.href = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent("Hello HUIJIA PET, I would like to discuss a custom pet accessories project.")}`;
  });
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} ${config.companyName || "HUIJIA PET"}. All rights reserved.`;
  });

  const serialize = (form) => Object.fromEntries(new FormData(form).entries());
  const mailtoFallback = (data) => {
    const subject = `RFQ — ${data.product || "Custom Pet Accessories"} — ${data.company || data.name || "Website Lead"}`;
    const body = [
      `Name: ${data.name || ""}`,
      `Business Email: ${data.email || ""}`,
      `Company: ${data.company || ""}`,
      `Product: ${data.product || ""}`,
      `Estimated Quantity: ${data.quantity || ""}`,
      `Target Market: ${data.market || ""}`,
      "",
      "Requirements:",
      data.requirements || ""
    ].join("\n");
    window.location.href = `mailto:${encodeURIComponent(config.email || "sales@yourdomain.com")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  document.querySelectorAll("[data-rfq-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const submit = form.querySelector('button[type="submit"]');
      const data = serialize(form);
      submit?.setAttribute("disabled", "disabled");
      if (status) status.textContent = "Sending…";
      try {
        if (!config.formEndpoint) {
          if (status) status.textContent = config.formErrorMessage || "Opening your email app…";
          mailtoFallback(data);
          return;
        }
        const response = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (status) status.textContent = config.formSuccessMessage || "Thank you. We will reply shortly.";
        form.reset();
        if (form.dataset.rfqForm === "quick") setTimeout(() => modal?.classList.remove("active"), 1200);
      } catch (error) {
        console.error(error);
        if (status) status.textContent = "Online submission failed. Opening your email app…";
        mailtoFallback(data);
      } finally {
        submit?.removeAttribute("disabled");
      }
    });
  });

  document.querySelector("[data-video-button]")?.addEventListener("click", () => {
    if (config.videoUrl) {
      window.open(config.videoUrl, "_blank", "noopener,noreferrer");
    } else {
      document.getElementById("factory")?.scrollIntoView({ behavior: "smooth" });
    }
  });
})();

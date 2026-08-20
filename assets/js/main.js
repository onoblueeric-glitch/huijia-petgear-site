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

  const emailContacts = Array.isArray(config.emailContacts)
    ? config.emailContacts.filter((contact) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact?.email || ""))
      )
    : [];
  const chooseEmailContact = () => emailContacts.length
    ? emailContacts[Math.floor(Math.random() * emailContacts.length)]
    : { name: "HUIJIA PET Sales", email: "sales@yourdomain.com" };

  const whatsappContact = config.whatsappContact || {};
  const whatsappNumber = /^\d{8,15}$/.test(String(whatsappContact.number || ""))
    ? String(whatsappContact.number)
    : "";
  const whatsappUrl = /^https:\/\/wa\.me\/\d{8,15}$/.test(String(whatsappContact.url || ""))
    ? String(whatsappContact.url)
    : whatsappNumber ? `https://wa.me/${whatsappNumber}` : "";

  document.querySelectorAll("[data-whatsapp-button]").forEach((el) => {
    if (!whatsappUrl) {
      el.hidden = true;
      return;
    }
    const contactName = whatsappContact.name || "HUIJIA PET";
    const icon = document.createElement("img");
    icon.src = "/assets/images/whatsapp-logo-official.svg";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    icon.width = 68;
    icon.height = 68;
    el.replaceChildren(icon);
    el.href = whatsappUrl;
    el.setAttribute("aria-label", `Chat with ${contactName} on WhatsApp`);
    el.title = `WhatsApp: ${contactName}`;
    el.hidden = false;
  });
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} ${config.companyName || "HUIJIA PET"}. All rights reserved.`;
  });

  const serialize = (form) => Object.fromEntries(new FormData(form).entries());
  const mailtoFallback = (data, recipient) => {
    const subject = `RFQ — ${data.product || "Custom Pet Accessories"} — ${data.company || data.name || "Website Lead"}`;
    const body = [
      `Name: ${data.name || ""}`,
      `Business Email: ${data.email || ""}`,
      `Phone / WhatsApp: ${data.phone || ""}`,
      `Company: ${data.company || ""}`,
      `Product: ${data.product || ""}`,
      `Estimated Quantity: ${data.quantity || ""}`,
      `Target Market: ${data.market || ""}`,
      "",
      "Requirements:",
      data.requirements || ""
    ].join("\n");
    window.location.href = `mailto:${encodeURIComponent(recipient.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  document.querySelectorAll("[data-rfq-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const submit = form.querySelector('button[type="submit"]');
      const data = serialize(form);
      const assignedEmail = chooseEmailContact();
      const recipientName = assignedEmail.name || "our sales team";
      submit?.setAttribute("disabled", "disabled");
      if (status) status.textContent = "Sending…";
      try {
        if (!config.formEndpoint) {
          if (status) status.textContent = `Opening your email app for ${recipientName}…`;
          mailtoFallback(data, assignedEmail);
          return;
        }
        const response = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            assignedSalesContact: recipientName,
            assignedSalesEmail: assignedEmail.email
          })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (status) status.textContent = config.formSuccessMessage || "Thank you. We will reply shortly.";
        form.reset();
        if (form.dataset.rfqForm === "quick") setTimeout(() => modal?.classList.remove("active"), 1200);
      } catch (error) {
        console.error(error);
        if (status) status.textContent = `Online submission failed. Opening your email app for ${recipientName}…`;
        mailtoFallback(data, assignedEmail);
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


/* Product gallery thumbnails */
document.querySelectorAll("[data-product-gallery]").forEach(function(gallery){
  var mainImage=gallery.querySelector("[data-gallery-main]");
  var thumbs=gallery.querySelectorAll("[data-gallery-thumb]");
  if(!mainImage||!thumbs.length)return;
  thumbs.forEach(function(button){
    button.addEventListener("click",function(){
      var nextSrc=button.getAttribute("data-src");
      var nextAlt=button.getAttribute("data-alt")||"";
      if(nextSrc){mainImage.src=nextSrc;mainImage.alt=nextAlt}
      thumbs.forEach(function(item){item.classList.remove("is-active")});
      button.classList.add("is-active");
    });
  });
});

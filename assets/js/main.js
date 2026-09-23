(() => {
  "use strict";
  const config = window.HUIJIA_SITE_CONFIG || {};
  const menu = document.getElementById("mainNav");
  const mobileToggle = document.getElementById("mobileToggle");
  const modal = document.getElementById("quoteModal");
  const modalClose = document.getElementById("modalClose");

  if (mobileToggle && menu) {
    mobileToggle.setAttribute("aria-controls", menu.id);
    const closeMenu = () => {
      menu.classList.remove("open");
      mobileToggle.setAttribute("aria-expanded", "false");
    };
    mobileToggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
        mobileToggle.focus();
      }
    });
    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !mobileToggle.contains(event.target)) closeMenu();
    });
  }

  const homeFilters = document.querySelector(".home-product-filters");
  const homeCards = [...document.querySelectorAll(".home-product-card[data-product-category]")];
  if (homeFilters && homeCards.length) {
    const filterButtons = [...homeFilters.querySelectorAll("[data-home-filter]")];
    const count = homeFilters.querySelector(".home-filter-count");
    homeFilters.hidden = false;
    const fallback = document.querySelector("[data-home-category-fallback]");
    if (fallback) fallback.hidden = true;
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.homeFilter;
        let visible = 0;
        homeCards.forEach((card) => {
          card.hidden = category !== "all" && card.dataset.productCategory !== category;
          if (!card.hidden) visible++;
        });
        filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        if (count) count.textContent = `${visible} styles`;
      });
    });
  }

  let modalTrigger = null;
  let generatedRequirements = "";
  let modalBackground = [];
  let previousBodyOverflow = "";
  const modalFocusTargets = () => modal ? [...modal.querySelectorAll(
    'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]'
  )].filter((element) =>
    element instanceof HTMLElement && element.tabIndex >= 0 &&
    !element.matches(":disabled") && !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
    element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden"
  ) : [];
  const closeModal = () => {
    if (!modal?.classList.contains("active")) return;
    modal.classList.remove("active");
    modalBackground.forEach(({ element, inert }) => { element.inert = inert; });
    modalBackground = [];
    document.body.style.overflow = previousBodyOverflow;
    if (modalTrigger?.isConnected && !modalTrigger.closest("[inert]")) {
      modalTrigger.focus({ preventScroll: true });
    }
    modalTrigger = null;
  };

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!modal) return;
      const productName = button.dataset.quoteProduct;
      const productInput = modal.querySelector('input[name="product"]');
      const requirements = modal.querySelector('textarea[name="requirements"]');
      if (productName && productInput) productInput.value = productName;
      if (productName && requirements && (!requirements.value.trim() || requirements.value === generatedRequirements)) {
        generatedRequirements = `Please quote ${productName}. Quantity: `;
        requirements.value = generatedRequirements;
      }
      if (!modal.classList.contains("active")) {
        modalTrigger = button;
        previousBodyOverflow = document.body.style.overflow;
        // Preserve existing inert states, including when the dialog is nested.
        for (let branch = modal; branch.parentElement && branch !== document.body; branch = branch.parentElement) {
          [...branch.parentElement.children].forEach((element) => {
            if (element === branch || !(element instanceof HTMLElement)) return;
            modalBackground.push({ element, inert: element.inert });
            element.inert = true;
          });
        }
        document.body.style.overflow = "hidden";
        modal.classList.add("active");
      }
      const focusTargets = modalFocusTargets();
      (focusTargets.find((element) => element.matches('input[name="name"]')) || focusTargets[0])?.focus();
    });
  });
  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("active")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    } else if (event.key === "Tab") {
      // Recalculate because inquiry delivery links may be added after opening.
      const focusTargets = modalFocusTargets();
      const first = focusTargets[0];
      const last = focusTargets[focusTargets.length - 1];
      if (!first) {
        event.preventDefault();
        return;
      }
      if (!focusTargets.includes(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  const fallbackEmailContacts = [
    { name: "Sales Team", email: "andy@huijiapetgear.com" }
  ];
  const configuredEmailContacts = Array.isArray(config.emailContacts)
    ? config.emailContacts.filter((contact) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact?.email || ""))
      )
    : [];
  const emailContacts = configuredEmailContacts.length ? configuredEmailContacts : fallbackEmailContacts;
  const chooseEmailContact = () => emailContacts[0];

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
    const icon = document.createElement("img");
    icon.src = "/assets/images/whatsapp-logo-official.svg";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    icon.width = 68;
    icon.height = 68;
    el.replaceChildren(icon);
    el.href = whatsappUrl;
    el.setAttribute("aria-label", "Chat on WhatsApp");
    el.title = `WhatsApp: ${whatsappContact.display || whatsappNumber}`;
    el.hidden = false;
  });
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = `© ${new Date().getFullYear()} ${config.companyName || "HUIJIA PET"}. All rights reserved.`;
  });

  const serialize = (form) => Object.fromEntries(new FormData(form).entries());
  const forms = [...document.querySelectorAll("[data-rfq-form]")];
  let onlineDelivery = false;
  const endpoint = config.formEndpoint || "";
  const setMode = (available) => {
    onlineDelivery = available;
    forms.forEach((form) => {
      const submit = form.querySelector('button[type="submit"]');
      if (submit) submit.textContent = available ? "Send Inquiry" : "Prepare Inquiry";
      const note = form.querySelector(".form-delivery-note");
      if (note) note.textContent = available
        ? "Send your requirements directly to our sales team."
        : "Prepare your inquiry, then choose email or WhatsApp to send it.";
    });
  };
  const inquiryText = (data) => [
    `Product: ${data.product || "Dog walking gear"}`,
    `Name: ${data.name || ""}`,
    `Business Email: ${data.email || ""}`,
    `Phone / WhatsApp: ${data.phone || ""}`,
    `Company: ${data.company || ""}`,
    `Quantity: ${data.quantity || ""}`,
    `Target Market: ${data.market || ""}`,
    "", "Requirements:", data.requirements || ""
  ].join("\n");
  const showDeliveryChoices = (form, data, message) => {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.replaceChildren(document.createTextNode(message));
    const actions = document.createElement("span");
    actions.className = "form-delivery-actions";
    const body = inquiryText(data);
    const mail = document.createElement("a");
    mail.className = "btn btn-primary";
    mail.textContent = "Open Email Draft";
    mail.href = `mailto:${encodeURIComponent(chooseEmailContact().email)}?subject=${encodeURIComponent(`RFQ — ${data.product || "Dog walking gear"}`)}&body=${encodeURIComponent(body)}`;
    actions.append(mail);
    if (whatsappUrl) {
      const chat = document.createElement("a");
      chat.className = "btn btn-outline";
      chat.textContent = "Open WhatsApp";
      chat.href = `${whatsappUrl}?text=${encodeURIComponent(body)}`;
      chat.target = "_blank";
      chat.rel = "noopener noreferrer";
      actions.append(chat);
    }
    status.append(actions);
  };
  forms.forEach((form) => {
    const trap = document.createElement("input");
    trap.name = "website";
    trap.type = "text";
    trap.tabIndex = -1;
    trap.autocomplete = "off";
    trap.className = "rfq-honeypot";
    trap.setAttribute("aria-hidden", "true");
    form.append(trap);
    for (const [name, length] of Object.entries({ name:100, email:254, phone:80, company:160, product:200, quantity:100, market:120, requirements:6000 })) {
      const field = form.elements.namedItem(name);
      if (field && ["INPUT", "TEXTAREA"].includes(field.tagName)) field.maxLength = length;
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.dataset.submitting === "true" || !form.reportValidity()) return;
      const data = serialize(form);
      const status = form.querySelector("[data-form-status]");
      const submit = form.querySelector('button[type="submit"]');
      if (!onlineDelivery) {
        showDeliveryChoices(form, data, "Your inquiry is ready. It has not been sent yet. Choose email or WhatsApp and send the prepared message there.");
        return;
      }
      form.dataset.submitting = "true";
      submit?.setAttribute("disabled", "disabled");
      if (status) status.textContent = "Sending your inquiry…";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(20000)
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error("Delivery not confirmed");
        if (status) status.textContent = config.formSuccessMessage || "Your inquiry has been submitted. Thank you.";
        form.reset();
      } catch {
        showDeliveryChoices(form, data, "We could not confirm online delivery. Your details are still here. You can send the prepared inquiry by email or WhatsApp.");
      } finally {
        form.dataset.submitting = "false";
        submit?.removeAttribute("disabled");
      }
    });
    form.addEventListener("input", () => {
      const status = form.querySelector("[data-form-status]");
      if (status && form.dataset.submitting !== "true") status.replaceChildren();
    });
  });
  setMode(false);
  if (endpoint && forms.length) {
    fetch(endpoint, { headers: { "Accept": "application/json" }, cache: "no-store", signal: AbortSignal.timeout(3500) })
      .then(response => response.ok ? response.json() : null)
      .then(result => setMode(result?.available === true))
      .catch(() => setMode(false));
  }

  document.querySelector("[data-video-button]")?.addEventListener("click", () => {
    if (config.videoUrl) {
      window.open(config.videoUrl, "_blank", "noopener,noreferrer");
    } else {
      document.getElementById("factory")?.scrollIntoView({ behavior: "smooth" });
    }
  });
  document.querySelectorAll("[data-lazy-youtube]").forEach((button) => {
    button.addEventListener("click", () => {
      const videoId = button.dataset.lazyYoutube;
      if (!/^[\w-]{11}$/.test(videoId || "")) return;
      const iframe = document.createElement("iframe");
      iframe.className = "factory-video";
      iframe.title = "Inside HUIJIA PET's custom dog harness, collar and leash factory";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;
      button.replaceWith(iframe);
    }, { once: true });
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

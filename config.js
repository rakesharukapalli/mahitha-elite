// Paste your Google Apps Script web app link between the quotes (it starts with https://script.google.com/...)
window.APP_CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbx2OiEUYjv9LL527BjC1YUzuMFxpslWwu5ORO-nZkBAuKfe70sSXScALz9OB4CrQdsKzQ/exec",

  // Bank QR code picture. Put the picture file in this same folder, then write its name here, e.g. "upi-qr.png". Leave "" for none.
  QR_IMAGE: "",

  // Websites opened by "Pay property tax" and "Pay electricity bill" (Tax & Electricity page).
  // Please open each link yourself once and change it if the official website has moved.
  PTAX_URL: "https://ptax.ghmc.gov.in/",
  POWER_URL: "https://tgsouthernpower.org/billinginfo"
};

(() => {
  const header = `
    <header class="site-header">
      <a class="brand" href="/" aria-label="Bloomary home">
        <img src="/app-logo.png" alt="">
        <span>Bloomary</span>
      </a>
      <nav class="nav" aria-label="Main">
        <a href="/">Home</a>
        <a href="/pricing/">Pricing</a>
        <a href="/mission/">Mission</a>
        <a href="/support/">Support</a>
        <details class="nav-menu">
          <summary>Legal</summary>
          <div class="nav-dropdown">
            <a href="https://platform.bloomary.life/">Bloomary platform</a>
            <a href="/terms/">Terms</a>
            <a href="/privacy/">Privacy</a>
            <a href="/cookie-policy/">Cookie policy</a>
            <a href="/legal-notice/">Legal notice</a>
            <a href="/refund-policy/">Refund policy</a>
          </div>
        </details>
        <a class="login-link" href="https://platform.bloomary.life/">Login</a>
      </nav>
    </header>`;

  const aiSummaryPrompt =
    "I'm exploring LinkedIn writing tools and want to understand how Bloomary helps founders, consultants, and operators turn real work into LinkedIn posts that build visibility, trust, leads, and revenue. Summarize the highlights from Bloomary's website: https://bloomary.life";
  const aiSummaryLinks = [
    ["ChatGPT", `https://chatgpt.com/?q=${encodeURIComponent(aiSummaryPrompt)}`],
    ["Google AI", `https://google.com/search?udm=50&q=${encodeURIComponent(aiSummaryPrompt)}`],
    ["Grok", `https://x.com/i/grok?text=${encodeURIComponent(aiSummaryPrompt)}`],
    ["Claude", `https://claude.ai/new?q=${encodeURIComponent(aiSummaryPrompt)}`],
    ["Perplexity", `https://perplexity.ai/?q=${encodeURIComponent(aiSummaryPrompt)}`],
  ]
    .map(
      ([name, url]) =>
        `<a href="${url}" target="_blank" rel="noopener" aria-label="Open ${name}">${name}</a>`,
    )
    .join("");

  const footer = `
    <footer class="site-footer">
      <div class="footer-toc">
        <nav class="footer-nav" aria-label="Product">
          <strong>Product</strong>
          <a href="/">Home</a>
          <a href="/#ios">iOS app</a>
          <a href="/#aha">Writing flow</a>
          <a href="/#outcomes">Outcomes</a>
          <a href="/#workflow">Workflow</a>
          <a href="/pricing/">Pricing</a>
        </nav>
        <nav class="footer-nav" aria-label="Company">
          <strong>Company</strong>
          <a href="/mission/">Mission</a>
          <a href="/support/">Support</a>
          <a href="https://t.me/+NDQcpuABme9iYTU0">Community</a>
        </nav>
        <nav class="footer-nav" aria-label="Legal">
          <strong>Legal</strong>
          <a href="https://platform.bloomary.life/">Bloomary platform</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="/cookie-policy/">Cookie policy</a>
          <a href="/legal-notice/">Legal notice</a>
          <a href="/refund-policy/">Refund policy</a>
        </nav>
        <nav class="footer-nav" aria-label="App">
          <strong>App</strong>
          <a href="https://platform.bloomary.life/">explore for free</a>
        </nav>
      </div>
      <div class="footer-ai-summary">
        <strong>Ask AI for a summary of Bloomary</strong>
        <div class="footer-ai-links">${aiSummaryLinks}</div>
      </div>
      <p class="footer-legal-line">© 2026 DailyMind LTD · HE 439959 · VAT CY10439959M</p>
    </footer>`;

  const siteHeader = document.querySelector("[data-site-header]");
  if (siteHeader) siteHeader.outerHTML = header;

  const siteFooter = document.querySelector("[data-site-footer]");
  if (siteFooter) siteFooter.outerHTML = footer;

  const consentKey = "bloomary_cookie_policy_choice";
  const hasConsent = () => {
    try {
      return Boolean(localStorage.getItem(consentKey));
    } catch (_error) {
      return false;
    }
  };
  const saveConsent = (choice) => {
    try {
      localStorage.setItem(consentKey, choice);
    } catch (_error) {
      // Consent banner can still close when storage is unavailable.
    }
  };

  if (!hasConsent()) {
    const banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.setAttribute("aria-label", "Cookie policy consent");
    banner.innerHTML = `
      <p>
        Bloomary uses essential browser storage for drafts and LinkedIn login as described in the <a href="/cookie-policy/">Cookie Policy</a>.
      </p>
      <div>
        <button type="button" data-cookie-choice="essential">Essential only</button>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cookie-choice]");
      if (!button) return;
      saveConsent(button.dataset.cookieChoice);
      banner.remove();
    });
    document.body.appendChild(banner);
  }
})();

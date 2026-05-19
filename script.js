/* smlksmth — tiny vanilla helpers */

(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── footer year ─────────────────────────────────────────── */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ── live clock (HH:MM:SS local) ─────────────────────────── */
  const clock = document.getElementById("clock");
  if (clock) {
    const tick = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── cursor-tracked warm glow ────────────────────────────── */
  const glow = document.querySelector(".glow");
  if (glow && !reduced && matchMedia("(pointer: fine)").matches) {
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.3;
    let cx = tx;
    let cy = ty;

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.setProperty("--mx", cx + "px");
      glow.style.setProperty("--my", cy + "px");
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });

    raf = requestAnimationFrame(loop);
  }

  /* ── magnetic period ─ tiny easter egg on the trailing dot ── */
  const period = document.querySelector(".name .period");
  if (period && !reduced && matchMedia("(pointer: fine)").matches) {
    const range = 90;
    const strength = 0.35;
    period.style.transition = "transform 320ms cubic-bezier(.2,.7,.2,1)";

    window.addEventListener("mousemove", (e) => {
      const r = period.getBoundingClientRect();
      const px = r.left + r.width / 2;
      const py = r.top + r.height / 2;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      const d = Math.hypot(dx, dy);
      if (d < range) {
        const f = (1 - d / range) * strength;
        period.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
      } else {
        period.style.transform = "";
      }
    }, { passive: true });
  }
})();

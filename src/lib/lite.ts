// Runs before first paint (inlined in <head>). `?lite=1` / `?lite=0` force the light mode on or off
// for this browser; otherwise a previous automatic decision (PerfGuard) is restored so it never flashes.
export const liteInitScript = `try{var q=new URLSearchParams(location.search).get("lite");if(q==="1"||q==="0")localStorage.setItem("lite",q);if(localStorage.getItem("lite")==="1")document.documentElement.classList.add("is-lite")}catch(e){}`;

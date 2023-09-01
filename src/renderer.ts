import "./index.css";

document.getElementById("auth").addEventListener("click", () => {
  console.log("click");
  (window as any).electronAPI.setTitle("dave");
});

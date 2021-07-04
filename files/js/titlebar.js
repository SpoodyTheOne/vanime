const titleBar = document.getElementById("title-container");

let hideTitlebarTimer = null;

window.addEventListener("mousemove", (event) => {
	if (event.clientY < 50) {
		showTitlebar();
	}
});

function showTitlebar() {
	if (document.fullscreenElement) return;

	titleBar.classList.remove("hidden");

	if (hideTitlebarTimer) clearTimeout(hideTitlebarTimer);

	hideTitlebarTimer = setTimeout(() => {
		titleBar.classList.add("hidden");
	}, 2000);
}

window.addEventListener("load", () => {
	showTitlebar();
});

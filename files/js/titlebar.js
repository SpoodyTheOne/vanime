const titleBar = document.getElementById("title-container");

let hideTitlebarTimer = null;
let ShouldHideTitle = false;

window.addEventListener("mousemove", (event) => {
	if (event.clientY < 25) {
		showTitlebar();
		ShouldHideTitle = true;
	} else if (ShouldHideTitle) {
		ShouldHideTitle = false;
		hideTitleBar();
	}
});

function showTitlebar() {
	if (document.fullscreenElement) return;

	titleBar.classList.remove("hidden");
}

function hideTitleBar() {
	if (hideTitlebarTimer) clearTimeout(hideTitlebarTimer);

	hideTitlebarTimer = setTimeout(() => {
		titleBar.classList.add("hidden");
	}, 2000);
}

hideTitleBar();

class Loader {
	static Show = () => {
		let loader = document.getElementById("loader");
		loader.style.display = "block";
		setTimeout(() => {
			loader.classList.remove("hidden");
            setTimeout(() => {
                loader.children[0].classList.remove("hidden");
            }, 500);
		}, 1);
	};

	static Hide = () => {
		let loader = document.getElementById("loader");
		loader.classList.add("hidden");
        loader.children[0].classList.add("hidden");
		setTimeout(() => {
			loader.style.display = "none";
		}, 500);
	};
}

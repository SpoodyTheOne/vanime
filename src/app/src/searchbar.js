class Searchbar {
	/** @type {HTMLInputElement} */
	static SearchElement;

	/**
	 * Initializes the searchbar with an input element
	 * @param {HTMLInputElement} page
	 */
	static init = (page, button) => {
		this.SearchElement = page;

		button.addEventListener("click", () => {
			this.Show();
		});

        //this.Hide();
	};

	static Show = () => {
		this.SearchElement.style.display = "flex";
		setTimeout(() => {
			this.SearchElement.classList.remove("hidden");
		}, 1);
	};

	static Hide = () => {
		this.SearchElement.classList.add("hidden");
		setTimeout(() => {
			this.SearchElement.style.display = "none";
		}, 500);
	};
}

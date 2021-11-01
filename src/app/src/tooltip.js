class Tooltip {
	/** @type {HTMLDivElement} */
	static TooltipElement = null;

	/** @type {HTMLButtonElement[]} */
	static Buttons = [];

	static init = () => {
		this.TooltipElement = document.getElementById("tooltip");
		document.body.addEventListener("click", (event) => {
			if (this.TooltipElement !== event.target && !this.TooltipElement.contains(event.target)) {
				this.HideTooltip();
			}
		});
	};

	/**
	 *
	 * @param {{clientX:number,clientY:number}} position
	 * @param {Anime} anime
	 */
	static ShowTooltip = async (position, text) => {
		this.TooltipElement.querySelector("h2").innerText = text;

		this.TooltipElement.classList.add("active");

		this.RemoveButtons();

		let offset = 0;

		if (position.clientX + this.TooltipElement.offsetWidth / 2 > window.innerWidth) {
			offset = window.innerWidth - (position.clientX + this.TooltipElement.offsetWidth / 2);
		}

		if (position.clientX - this.TooltipElement.offsetWidth / 2 < 0) {
			offset = 0 - (position.clientX - this.TooltipElement.offsetWidth / 2);
		}

		offset -= this.TooltipElement.offsetWidth / 2;

		this.TooltipElement.style.top = position.clientY + 20 + "px";
		this.TooltipElement.style.left = position.clientX + offset + "px";
	};

	static HideTooltip = () => {
		this.TooltipElement.classList.remove("active");
	};

	static RemoveButtons = () => {
		if (this.Buttons.length == 0) return;

		for (let button of this.Buttons) {
			button.remove();
		}

		this.Buttons = [];
	};

	/**
	 *
	 * @param {{clientX:number,clientY:number}} position
	 * @param  {...TooltipButton} args
	 */
	static CreateContextMenu = async (position, text, ...args) => {
		this.ShowTooltip(position, text);

		for (let arg of args) {
			let button = document.createElement("button");

			button.innerText = arg.Text;
			button.addEventListener("click", async (event) => {
				await this.HideTooltip();
				event.preventDefault();
				setTimeout(() => {
					arg.Callback(event);
				}, 100);
			});

			this.TooltipElement.appendChild(button);
			this.Buttons.push(button);
		}
	};
}

class TooltipButton {
	/**
	 *
	 * @param {string} text
	 * @param {Function} callback
	 */
	constructor(text, callback) {
		this.Text = text;
		this.Callback = callback;
	}
}

class Tooltip
{
    /** @type {HTMLDivElement} */
    static TooltipElement = null;

    static init = () => {
        this.TooltipElement = document.getElementById("tooltip");
    }

    /**
	 *
	 * @param {{clientX:number,clientY:number}} event
	 * @param {Anime} anime
	 */
	static ShowTooltip = async (position, text) => {
		this.TooltipElement.querySelector("h2").innerText = text;

		this.TooltipElement.classList.add("active");

		let offset = 0;

		if (position.clientX + this.TooltipElement.offsetWidth / 2 > window.innerWidth) {
			offset = window.innerWidth - (position.clientX + this.TooltipElement.offsetWidth / 2);
		}

		offset -= this.TooltipElement.offsetWidth / 2;

		this.TooltipElement.style.top = position.clientY + 20 + "px";
		this.TooltipElement.style.left = position.clientX + offset + "px";
	};

	static HideTooltip = () => {
		this.TooltipElement.classList.remove("active");
	};
}
(function (semexp) {
	/**
	 * @class
	 * Filter used to define constraints. These are applied by the model
	 * when it is queried for entities or relations
	 */
	semexp.filter = {
		entititiesFilter : undefined,
		relationsFilter : undefined
	};
}(window.semexp || {}));
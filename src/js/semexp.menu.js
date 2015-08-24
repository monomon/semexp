(function(semexp) {
	'use strict';
	
	var privateData = {};

	/**
	 * @class
	 * Web form used to interact with the semantic network
	 */
	semexp.menu = {
		factWidgets : [],
		relationWidgets : [],

		/**
		 * draw menu
		 * @return {Element} menu element
		 */
		draw : function ()
		{
			var explorer = this.explorer;

			var filterData = explorer.model.getFilterData();

			var menuEl = d3.select('body').selectAll('.controls')
				.data([filterData]);

			var menuElEnter = menuEl.enter()
				.append('sidebar')
				.classed('controls', true);

			var form = menuElEnter.append('form')
				.on('submit', function() {
					if (d3.event) d3.event.preventDefault();

					var value = menuEl.select('input[type=text]').property('value');
					if (!value || value === '') {
						return false;
					}

					explorer.addNode(value);
					menuEl.select('input[type=text]').property('value', '');
				});

			// fixme: automate this stuff a little more
			var elType = 'div';

			form.append('label').text('node name');
			form.append('input')
				.attr('type','text')
				.attr('name', 'name')
				.attr('placeholder', 'name');
			form.append('input')
				.attr('type','submit')
				.property('value', 'add node');

			menuElEnter.append(elType)
				.call(function (sel) {
					explorer.menu.createFactSelector(
						sel,
						'default',
						'default fact',
						function (newData, oldData) {
							explorer.model.defaultFact = newData;
						},
						filterData
					);
				});


			this.createRelationSelector(
				menuElEnter.append(elType),
				'default',
				'default relation',
				function (newData, oldData) {
					explorer.model.defaultRelation = newData;
				},
				filterData
			);

			this.createFactSelector(
				menuElEnter.append(elType),
				'filter',
				'filter fact',
				function(newValue, oldValue)
				{
					explorer.model.updateFilterData.call(
						explorer.model,
						{
							entities : newValue
						}
					);
				},
				filterData
			).append('input')
				.attr('type', 'checkbox')
				.style({'width': 15, 'flex' : 'none'})
				.attr('name', 'filterFactToggle')
				.on('change', this.updateCheckbox);

			this.createRelationSelector(
				menuElEnter.append(elType),
				'filter',
				'filter relation',
				function(newValue, oldValue)
				{
					explorer.model.updateFilterData.call(
						explorer.model,
						{
							relations : newValue
						}
					);
				},
				filterData
			).append('input')
				.attr('type', 'checkbox')
				.style({'width': 15, 'flex' : 'none'})
				.attr('name', 'filterRelationToggle')
				.on('change', this.updateCheckbox)
				.property('checked', function (d) {
					return d[this.name];
				});

			var saveGroup = menuElEnter.append(elType);
			saveGroup.append('input')
				.attr('type', 'text');

			saveGroup.append('input')
				.attr('type', 'button')
				.property('value', 'save as')
				.on('click', function () {
					explorer.save.call(explorer);
				});

			var buttonGroup = menuElEnter.append(elType);
			buttonGroup.append(elType).append('input')
				.attr('type','button')
				.property('value', 'get JSON')
				.on('click', function () {
					explorer.getJSON.call(explorer);
				});

			buttonGroup.append(elType).append('input')
				.attr('type','button')
				.property('value', 'clear')
				.on('click', function () {
					explorer.clear();
				});
			var loadContainer = menuElEnter.append(elType);
			var dataSelect = loadContainer.append('select').attr('size', 2);
			for (var key in testData) {
				console.log(key);
				dataSelect.append('option').property('value', key).text(key);
			}
			loadContainer.append(elType)
				.append('input')
				.attr('type', 'button')
				.property('value', 'load from local storage')
				.on('click', function () {
					console.log(this);
				});
			menuEl.exit().remove();

			return menuEl;
		},

		/**
		 * Create a select element for facts. This contains all facts as options
		 * @param {Element} rootElement Element to which to append the selector
		 * @param {String} basename Base name used for building up the input name, etc.
		 * @param {String} label Text for the label
		 * @param {Function} buttonCallback Callback function for the button that triggers an update
		 * @param {Object} data Data passed to the d3 update selection; used for the databinding
		 * @return {Element} The select DOM element
		 */
		createFactSelector : function(rootElement, basename, label, buttonCallback, data)
		{
			var explorer = this.explorer;

			var relations = Object.keys(explorer.model.getRelations());
			var entities = explorer.model.getEntities();
			var name = basename + 'FactRelation';

			// relations linked to entities
			relations = relations.map(function (item) {
				return {
					value : item,
					children : 'entities'
				};
			});

			rootElement.append('label').text(label);

			rootElement
				.append('div')
				.attr('name', name)
				.classed('relationSelector', true)
				.call(function (selection) {
					if (selection.node()){
						var factWidget = new AutoComplete(
							selection.node(), {
							initialList : 'relations',
							lists : {
								relations : relations,
								entities : entities
							},
							onChange : buttonCallback
						});

						if (data && data.entities) {
							factWidget.setData(data.entities);
						}

						explorer.menu.factWidgets.push(factWidget);
					}
				});

			return rootElement;
		},

		/**
		 * Create a relation select element; lists all relations as options
		 * @param {Element} rootElement DOM element to append the selector to
		 * @param {String} basename Used for forming the input element's name, etc.
		 * @param {Function} changeCallback Callback for the selector's change event; used to update
		 * external entities
		 * @param {Object} data passed to the d3 update selection to create the data binding
		 * @return {Element} The select element
		 */
		createRelationSelector : function(rootElement, basename, label, changeCallback, data)
		{
			var explorer = this.explorer;

			var relations = Object.keys(explorer.model.getRelations());
			var name = basename + 'Relation';

			rootElement.append('label').text(label);
			rootElement
				.append('div')
				.attr('name', name)
				.classed('relationSelector', true)
				.call(function (selection) {
					if (selection.node()){
						var relWidget = new AutoComplete(
							selection.node(), {
							initialList : 'relations',
							lists : {
								relations : relations
							},
							onChange : changeCallback
						});

						if (data && data.relations) {
							relWidget.setData(data.relations);
						}

						explorer.menu.relationWidgets.push(relWidget);
					}
				});

			return rootElement;
		},

		/**
		 * update data from a change event of an input
		 *
		 */
		updateData : function (newValue, oldValue)
		{
			privateData = newValue;
			d3.select('.controls').data(privateData);
		},

		/**
		 * update data from a checkbox
		 */
		updateCheckbox : function ()
		{
			privateData[this.name] = this.checked;
			d3.select('.controls').data([privateData]);
		},

		/**
		 * apply passed data to private data
		 * @param {Object} data
		 */
		applyData : function (data)
		{
			for (var key in data) {
				privateData[key] = data[key];
			}
			this.refresh();
		},

		/**
		 * obtain data from the private object
		 * @param {String} key (optional)
		 * if passed, return the value at the key
		 * if empty, return the whole private object
		 * @return {Mixed} Entire data object or single item
		 */
		getData : function (key)
		{
			if (key) {
				return privateData[key];
			} else {
				return privateData;
			}
		},

		/**
		 * refresh the menu by redrawing
		 * this could be made smarter
		 */
		refresh : function ()
		{
			var model = this.explorer.model;
			var relations = Object.keys(model.getRelations());
			this.relationWidgets.forEach(function (item) {
				item.setList('relations', relations);
			});

			this.factWidgets.forEach(function (item) {
				item.setList('entities', model.getEntities());
				item.setList('relations', {
					children : 'entities',
					options : relations
				});
			});
		}
	};

	return semexp;
}(window.semexp || {}));

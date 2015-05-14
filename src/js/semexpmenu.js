(function(semexp) {
	'use strict';

	/**
	 * Default data for the menu
	 */
	var defaultData = {
		defaultFactRelation : undefined,
		defaultFactEntity : undefined,
		defaultRelation : undefined,
		filterFactRelation : undefined,
		filterFactEntity : undefined,
		filterFactToggle : false,
		filterRelation : undefined,
		filterRelationToggle : false
	};

	var privateData = defaultData;

	/**
	 * @class semexp.menu
	 */
	semexp.menu = {
		/**
		 * draw menu
		 * @return {Element} menu element
		 */
		draw : function ()
		{
			var explorer = this.explorer;

			var menuData = privateData;

			var menuEl = d3.select('.controls')
				.data([menuData])
				;

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

			this.createFactSelector(
				menuElEnter.append(elType),
				'default',
				'default fact',
				function () {
					explorer.refresh();
				},
				menuData
			);

			this.createRelationSelector(
				menuElEnter.append(elType),
				'default',
				'default relation',
				function () {
					explorer.refresh();
				},
				menuData
			);

			this.createFactSelector(
				menuElEnter.append(elType),
				'filter',
				'filter fact',
				function () {
					explorer.refresh();
				},
				menuData
			).append('input')
				.attr('type', 'checkbox')
				.style({'width': 15, 'flex' : 'none'})
				.attr('name', 'filterFactToggle')
				.on('change', this.updateCheckbox);

			d3.select('input[name=filterFactToggle]')
				.property('checked', function (d) {
					return d[this.name];
				});

			this.createRelationSelector(
				menuElEnter.append(elType),
				'filter',
				'filter relation',
				function () {
					explorer.refresh();
				},
				menuData
			).append('input')
				.attr('type', 'checkbox')
				.style({'width': 15, 'flex' : 'none'})
				.attr('name', 'filterRelationToggle')
				.on('change', this.updateCheckbox)
				.property('checked', function (d) {
					return d[this.name];
				});

			d3.select('input[name=filterRelationToggle]')
				.property('checked', function (d) {
					return d[this.name];
				});

			var buttonGroup = menuElEnter.append(elType);
			buttonGroup.append('input')
				.attr('type', 'button')
				.property('value', 'save')
				.on('click', function () {
					explorer.save.call(explorer);
				});

			buttonGroup.append(elType)
				.append('input')
				.attr('type', 'button')
				.property('value', 'load')
				.on('click', function () {
					console.log(this);
				});

			// this.applyData(menuData);

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

			rootElement.append('label').text(label);
			var relations = Object.keys(explorer.model.getRelations());

			rootElement.append('select')
				.attr('name', basename + 'FactRelation')
				.classed('relationSelector', true)
				.on('change', this.updateData);

			var select = d3.select('.relationSelector[name=' +
				basename +
				'FactRelation]');

			var options = select.selectAll('option')
				.data(relations);

			options.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			options.exit().remove();

			select.property('value', function () {
				return data[this.name];
			});

			var entities = explorer.model.getEntities();

			rootElement.append('select')
				.attr('name', basename + 'FactEntity')
				.classed('entitySelector', true)
				.on('change', this.updateData);
			
			// this is not the update selection
			// force update all options, because
			// data is not bound to menu data
			var select2 = d3.select('.entitySelector[name=' +
				basename +
				'FactEntity]');

			var options2 = select2.selectAll('option')
				.data(entities);

			options2.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			select2.property('value', function () {
				return data[this.name];
			});

			rootElement.append('input')
				.property('value', 'apply')
				.property('type', 'button')
				.on('click', buttonCallback);

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
			rootElement.append('select')
				.attr('name', name)
				.classed('relationSelector', true)
				.on('change', this.updateData);

			var select = d3.select('.relationSelector[name='+name+']');

			var options = select.selectAll('option').data(relations).enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			select.property('value', function () {
				return data[this.name];
			});

			return rootElement;
		},

		/**
		 * update data from a change event of an input
		 *
		 */
		updateData : function ()
		{
			privateData[this.name] = this.value;
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
			this.draw();
		}
	};

	return semexp;
}(window.semexp || {}));
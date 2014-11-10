(function(semexp) {
	'use strict';

	var defaultData = {
		defaultFactRelation : undefined,
		defaultFactEntity : undefined,
		defaultRelation : undefined,
		filterFactRelation : undefined,
		filterFactEntity : undefined,
		filterFactToggle : true,
		filterRelation : 'is',
		filterRelationToggle : false
	};

	var privateData = defaultData;

	semexp.menu = {
		draw : function (data)
		{
			var explorer = this.explorer;

			var menuData = data || privateData;

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
				}
			);

			this.createRelationSelector(
				menuElEnter.append(elType),
				'default',
				'default relation',
				function () {
					explorer.refresh();
				}
			);

			this.createFactSelector(
				menuElEnter.append(elType),
				'filter',
				'filter fact',
				function () {
					explorer.refresh();
				}
			).append('input')
				.attr('type', 'checkbox')
				.style({'width': 15, 'flex' : 'none'})
				.attr('name', 'filterFactToggle')
				.on('change', this.updateCheckbox)
				.property('checked', function (d) {
					return d.filterFactToggle;
				});

			this.createRelationSelector(
				menuElEnter.append(elType),
				'filter',
				'filter relation',
				function () {
					explorer.refresh();
				}
			).append('input')
				.attr('type', 'checkbox')
				.style({'width': 15, 'flex' : 'none'})
				.attr('name', 'filterRelationToggle')
				.on('change', this.updateCheckbox)
				.property('checked', function (d) {
					return d.filterRelationToggle === true;
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

		createFactSelector : function(rootElement, basename, label, buttonCallback)
		{
			var explorer = this.explorer;

			rootElement.append('label').text(label);
			var relations = Object.keys(explorer.model.getRelations());

			var select = rootElement.append('select')
				.attr('name', basename + 'FactRelation')
				.classed('relationSelector', true)
				.on('change', this.updateData);

			var options = d3.select('.relationSelector[name=' +
				basename +
				'FactRelation]').selectAll('option')
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

			var entities = explorer.model.getEntities();

			var select2 = rootElement.append('select')
				.attr('name', basename + 'FactEntity')
				.classed('entitySelector', true)
				.on('change', this.updateData);

			// this is not the update selection
			// force update all options, because
			// data is not bound to menu data
			var options2 = d3.select('.entitySelector[name=' +
				basename +
				'FactEntity]').selectAll('option')
				.data(entities);

			options2.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			rootElement.append('input')
				.property('value', 'apply')
				.property('type', 'button')
				.on('click', buttonCallback);

			return rootElement;
		},

		createRelationSelector : function(rootElement, basename, label, changeCallback)
		{
			var explorer = this.explorer;

			var relations = Object.keys(explorer.model.getRelations());

			rootElement.append('label').text(label);
			var select = rootElement.append('select')
				.attr('name', basename + 'Relation')
				.classed('relationSelector', true)
				.on('change', this.updateData);

			d3.select('.relationSelector[name='+basename+'Relation]').selectAll('option')
				.data(relations)
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			return rootElement;
		},

		// update data from a change event
		updateData : function ()
		{
			privateData[this.name] = this.value;
			d3.select('.controls').data(privateData);
		},

		updateCheckbox : function ()
		{
			privateData[this.name] = this.checked;
			d3.select('.controls').data([privateData]);
		},

		// apply data to controls
		applyData : function (data)
		{
			for (var key in data) {
				privateData[key] = data[key];
			}
			this.refresh(privateData);
		},

		getData : function (key)
		{
			if (key) {
				return privateData[key];
			} else {
				return privateData;
			}
		},

		refresh : function ()
		{
			this.draw(privateData);
		}
	};

	window.semexp = semexp;

	return semexp;
}(window.semexp || {}));
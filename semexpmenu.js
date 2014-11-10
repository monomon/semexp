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
		filterRelationToggle : true
	};

	semexp.menu = {
		draw : function (data)
		{
			var explorer = this.explorer;

			var menuEl = d3.select('body')
				.append('sidebar')
				.classed('controls', true);

			var menuData = data || defaultData;
			menuEl.datum(menuData);

			var form = menuEl.append('form')
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
				menuEl.append(elType),
				'default',
				'default fact',
				function () {
					explorer.refresh();
				}
			);

			this.createRelationSelector(
				menuEl.append(elType),
				'default',
				'default relation',
				function () {
					explorer.refresh();
				}
			);

			this.createFactSelector(
				menuEl.append(elType),
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
				.property('checked', menuData.filterFactToggle);

			this.createRelationSelector(
				menuEl.append(elType),
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
				.property('checked', menuData.filterRelationToggle);

			var buttonGroup = menuEl.append(elType);
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

			menuEl.selectAll('select').each(function (data) {
				console.log(data[this.name] = this.value);
			});

			console.log(menuData);

			this.applyData(menuData);

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

			select.selectAll('option')
				.data(relations)
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			select.property('value', relations[0]);

			var entities = explorer.model.getEntities();
			select = rootElement.append('select')
				.attr('name', basename + 'FactEntity')
				.classed('entitySelector', true)
				.on('change', this.updateData);

			select.selectAll('option')
				.data(entities)
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			select.property('value', entities[0]);

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
				.on('change', this.updateData);

			select.selectAll('option')
				.data(relations)
				.enter()
				.append('option')
				.attr('value', function(d) {
					return d;
				})
				.text(function(d) {
					return d;
				});

			select.property('value', relations[0]);


			return rootElement;
		},

		// update data from a change event
		updateData : function ()
		{
			var d = d3.select('.controls').datum();
			d[this.name] = this.value;
			d3.select('.controls').datum(d);
		},

		updateCheckbox : function ()
		{
			var d = d3.select('.controls').datum();
			d[this.name] = this.checked;
			this.value = this.checked;
			d3.select('.controls').datum(d);
		},

		// apply data to controls
		applyData : function (data)
		{
			var rootElement = d3.select('.controls');
			for (var key in data) {
				var el = rootElement.select('[name=' + key + ']');
				el.property('value', data[key]);
			}
		},

		getData : function (key)
		{
			if (key) {
				return d3.select('.controls').datum()[key];
			} else {
				return d3.select('.controls').datum();
			}
		},

		refresh : function ()
		{
			d3.selectAll('.entitySelector').data(this.explorer.model.getEntities());
			d3.selectAll('.relationSelector').data(this.explorer.model.getRelations());
		}
	};

	window.semexp = semexp;

	return semexp;
}(window.semexp || {}));
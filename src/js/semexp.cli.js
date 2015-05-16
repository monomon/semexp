(function(semexp) {

	var history = [];
	/**
	 * @class
	 * Command-line interface
	 */
	semexp.cli = {
		draw : function ()
		{
			var explorer = this.explorer;

			var cliEl = document.createElement('div');
			cliEl.className = 'cli';

			var historyEl = document.createElement('div');
			historyEl.className = 'history';
			historyEl.innerHTML = '<br>';
			
			var inputEl = document.createElement('input');
			inputEl.className = 'input';
			inputEl.setAttribute('type', 'text');
			inputEl.addEventListener('keypress', this.handleInput);


			cliEl.appendChild(historyEl);
			cliEl.appendChild(inputEl);
			document.documentElement.appendChild(cliEl);
		},

		handleInput : function (evt)
		{
			if (evt.which == 13) {
				history.push(evt.target.value);
				var historySel = d3.select('.cli .history');
				var sel = historySel.selectAll('p').data(history);

				sel.enter()
					.append('p')
					.html(function(d) {
						return d;
					});

				historySel.node.scrollTop = historySel.node.scrollHeight;
				console.log(evt.target.value);
				evt.target.value = '';
			}
		}
	};

}(window.semexp || {}));
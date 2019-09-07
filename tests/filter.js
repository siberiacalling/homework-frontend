'use strict';

QUnit.module('Проверка работы функции filter', function () {
	QUnit.test('filter экранирует символы в обычном тексте', function (assert) {
		const input = '- "42!", сказала Машина. Это и был главный ответ на Вопрос жизни, вселенной & всего такого...';

		const output = filter(input, [ 'strong', 'em' ]);

		const expected = '- &quot;42!&quot;, сказала Машина. Это и был главный ответ на Вопрос жизни, вселенной &amp; всего такого...';
		assert.strictEqual(output, expected);
	});

	QUnit.test('filter не экранирует валидные html-тэги', function (assert) {
		const input = '<strong>Hello, <em>World!</em></strong> 1 + 2 < 4!';

		const output = filter(input, [ 'strong', 'em' ]);
		const expected = '<strong>Hello, <em>World!</em></strong> 1 + 2 &lt; 4!'
		assert.strictEqual(output, expected);
	});

	QUnit.test('filter экранирует XSS', function (assert) {
		assert.strictEqual(filter(`<script>alert('1');</script>`, [ 'strong', 'em' ]), '&lt;script&gt;alert(&#39;1&#39;);&lt;/script&gt;');
		assert.strictEqual(filter(`<img src="bad" onerror="alert('1');">`, [ 'strong', 'em' ]), '&lt;img src=&quot;bad&quot; onerror=&quot;alert(&#39;1&#39;);&quot;&gt;');
	});

	QUnit.test('filter не экранирует валидные html-тэги, если они вперемешку с невалидными', function (assert) {
		const input = '<div>Hello, <h1>World!</h1></div> 1 + 2 < 4!';

		const output = filter(input, [ 'h1' ]);
		const expected = '&lt;div&gt;Hello, <h1>World!</h1>&lt;/div&gt; 1 + 2 &lt; 4!'
		assert.strictEqual(output, expected);
	});

	QUnit.test('filter не экранирует валидный одиночный html-тэг', function (assert) {
		const input = '<img src="{% static \'anon.png\' %}" width="55" height="55" class="img-avatar-header"/>';

		const output = filter(input, [ 'img' ]);
		const expected = '<img src=&quot;{% static \&#39;anon.png\&#39; %}&quot; width=&quot;55&quot; height=&quot;55&quot; class=&quot;img-avatar-header&quot;/>'
		assert.strictEqual(output, expected);
	});
});

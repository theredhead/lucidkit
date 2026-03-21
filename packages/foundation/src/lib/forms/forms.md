# Interactive, configurable forms.

I want too build a generic way to build consistent forms of all kinds, where forms
can be split into groups that can be presented in wizard like form or just sequentially.

form fields have at a unique id, a title, optional description, an actual input element
with all it's meta data and validation rules.

both fields and field groups can be enabled/visibla strictly depending
on the live values of other (earlier) form fields.

the form setup should initially be entirely definable in json and it's result should also just be json.

it should support any input type already existing but also yet to come, that exposes a two vay 'value' model

I will need a designer to model forms that allows me to place fields, order them, configure validation, actual components, and meta data.

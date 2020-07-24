---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
rows: 40
columns: 60
---

{% for row in (1..page.rows) %}
<div class="d-flex gridrow {{ page.rows }} {{ page.columns }}">
{% for col in (1..page.columns) %}
<div class="cell l8" id="{{ row | minus: 1 }}-{{ col | minus: 1 }}"> </div>
{% endfor %}
</div>
{% endfor %}



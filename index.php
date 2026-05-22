<!DOCTYPE html>
<html lang="en-US">
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<script type="module">
console.log(window.location.href);
const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get('id'), urlParams.get('title'), urlParams);
for (const p of urlParams) {
  console.log(p);
}
const loader = new (await import('/loader.js')).Loader;
const page = (await import(`/categories.js`)).main(loader);
</script>
</body>
</html>
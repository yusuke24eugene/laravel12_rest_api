<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="/products/1" method="POST">
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
        @method('DELETE')
        <input type="text" name="name" placeholder="name"><br>
        <input type="text" name="description" placeholder="description"><br>
        <input type="text" name="price" placeholder="price"><br>

        <input type="submit">
    </form>
</body>
</html>
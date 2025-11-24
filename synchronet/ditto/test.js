test.js
```
  location = u.location.substring(0, width_location)
  rpad(location, width_location + column_padding);
  d_location = leet_color(location)
```  
  comma
```  
  location = rpad(u.location.substring(0, width_location), width_location + column_padding);
  d_location = leet_color(location)
```
  or
```
  d_location = leet_color(rpad(u.location.substring(0, width_location), width_location + column_padding))
```
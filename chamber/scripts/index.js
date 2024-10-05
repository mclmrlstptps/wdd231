$.ajax({
    url: 'https://openweathermap.org/api',
    dataType: 'json',
    success: function(data) {
      console.log(data);
    }
  });
      
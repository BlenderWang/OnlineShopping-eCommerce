$(function() {
    var stripe = Stripe('pk_test_g8und0gohmjFGK5cmW4sbn6f');

    $('#search').keyup(function() {
        var search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/api/search',
            data: {
                search_term
            },
            dataType: 'json',
            success: function(json) {
                var data = json.hits.hits.map(function(hit) {
                    return hit;
                });
                // console.log(data);

                $('#searchResults').empty();
                for(var i = 0; i < data.length; i++) {
                    var html = '';
                    html += '<div class="col-md-4">';
                    html += '<a href="/product/' + data[i]._source._id + '">';
                    html += '<div class="card mb-4 shadow-sm">';
                    html += '<img src="<%= data[i]._source.image %>" class="card-img-top" alt="thumbnail img">';
                    html += '<div class="card-body">';
                    html += '<h5 class="card-title">' + data[i]._source.name + '</h5>';
                    html += '<p class="card-text">' + data[i]._source.category.name + '</p>';
                    html += '<p class="card-text">' + data[i]._source.price + '<em>kr</em></p>';
                    html += '<div class="d-flex justify-content-between align-items-center">';
                    html += '<a href="#" class="btn btn-success">Köp</a>';
                    html += '<small class="text-muted"><i class="fas fa-eye"></i><em>32</em></small>';
                    html += '</div></div></div></a></div>';

                    $('#searchResults').append(html);
                }
            },

            error: function(error) {
                console.log(err);
            }
        });
    });

    $(document).on('click', '#plus', function(e) {
        e.preventDefault();
        var priceValue = parseFloat($('#priceValue').val());
        var quantity = parseInt($('#quantity').val());

        priceValue += parseFloat($('#priceHidden').val());
        quantity += 1;

        $('#quantity').val(quantity);
        $('#priceValue').val(priceValue.toFixed(2));
        $('#total').html(quantity);
    });

    $(document).on('click', '#minus', function(e) {
        e.preventDefault();
        var priceValue = parseFloat($('#priceValue').val());
        var quantity = parseInt($('#quantity').val());

        if(quantity == 1) {
            priceValue = $('#priceHidden').val();
            quantity = 1;
        }else {
            priceValue -= parseFloat($('#priceHidden').val());
            quantity -= 1;
        }

        $('#quantity').val(quantity);
        $('#priceValue').val(priceValue.toFixed(2));
        $('#total').html(quantity);
    });

    function stripeResponseHandler(status, response) {
        var $form = $('#payment-form');

        if (response.error) {
          // Show the errors on the form
          $form.find('.payment-errors').text(response.error.message);
          $form.find('button').prop('disabled', false);
        } else {
          // response contains id and card, which contains additional card details
          var token = response.id;
          // Insert the token into the form so it gets submitted to the server
          $form.append($('<input type="hidden" name="stripeToken" />').val(token));

          var spinner = new Spinner(opts).spin();
          $('#loading').append(spinner.el);
          // and submit
          $form.get(0).submit();
        }
      };


      $('#payment-form').submit(function(event) {
        var $form = $(this);

        // Disable the submit button to prevent repeated clicks
        $form.find('button').prop('disabled', true);

        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from submitting with the default action
        return false;
      });

});

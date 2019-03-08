$(function() {
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
});
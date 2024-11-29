// $(document).ready(function() {
//     $('.dropdown-item').on('click', function(e) {
//         e.preventDefault();

//         // Ambil target konten dari atribut data-target
//         var target = $(this).data('target');
//         var href = $(this).attr('href');

//         // Lakukan request AJAX untuk mendapatkan konten dari URL yang diinginkan
//         $.ajax({
//             url: href,
//             method: 'GET',
//             success: function(data) {
//                 // Ganti konten di dalam #content-area dengan data yang diterima
//                 $('#content-area').html(data);
//             },
//             error: function() {
//                 alert("Failed to load content.");
//             }
//         });
//     });
// });

<script>
$(document).ready(function() {
    $('.dropdown-item').on('click', function(event) {
        event.preventDefault(); // Mencegah navigasi default
        var endpoint = $(this).attr('href'); // Mendapatkan endpoint dari href
        $('#content-area').load(endpoint); // Memuat konten dari endpoint ke dalam #content-area
    })
});
</script>


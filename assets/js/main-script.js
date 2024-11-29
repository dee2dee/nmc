<script>
    $(document).ready(function() {
        
        // Sidebar collaps
        $('#sidebarCollapse').on('click', function(){
            $('#sidebar').toggleClass('collapsed');
            $('#content').toggleClass('expanded');
        });


        // Navigator menu
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        const currentPath = window.location.pathname;

        sidebarItems.forEach(item => {
                if (item.getAttribute('href') === currentPath) {
                    item.classList.add('active');
                }
            });

        sidebarItems.forEach(item => {
            item.addEventListener('click', function(event) {
                event.preventDefault();
                sidebarItems.forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                const targetHref = this.getAttribute('href');
                if (targetHref === '/contact') {
                    window.location.href = '/contact';
                } else if (targetHref === '/escalation') {
                    window.location.href = '/escalation';
                    } else if (targetHref === '/extention') {
                        window.location.href = '/extention';
                    }
                });
            });


        // Modal add contact
        $('#addContactModal').on('show.bs.modal', function (event) {
            $('#addContactFirstName').val('');
            $('#addContactLastName').val('');
            $('#addContactAddress').val('');
            $('#addContactEmail').val('');
            $('#addContactEmail2').val('');
            $('#addContactWork').val('');
            $('#addContactMobile').val('');
        });

        $('#saveNewContact').on('click', function() {
            var firstname = $('#addContactFirstName').val();
            var lastname = $('#addContactLastName').val();
            var address = $('#addContactAddress').val();
            var email = $('#addContactEmail').val();
            var email2 = $('#addContactEmail2').val();
            var work = $('#addContactWork').val();
            var mobile = $('#addContactMobile').val();

            var dataToSend = {
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                email2: email2,
                work: work,
                mobile: mobile
            };

            var jsonData = JSON.stringify(dataToSend);
            console.log("JSON Data:", jsonData);

            $.ajax({
                url: '/contact',
                type: 'POST',
                contentType: 'application/json',
                data: jsonData,
                success: function(response) {
                    const name = response.name || "Contact";
                    $("#successAlert").text(name + " Contact added successfully!").removeClass('d-none');
                    setTimeout(function() {
                        $("#successAlert").addClass('d-none');
                    }, 3000);
                    $('#addContactForm')[0].reset();
                    $('#addContactForm input[name="firstname"]').focus();

                },
                error: function(error) {
                    console.error("Error:", error);
                    alert("An error occurred while adding a contact.");
                }
                });
            });


        // Modal view contact
        $('#viewContactModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var firstname = button.data('firstname');
            var lastname = button.data('lastname');
            var address = button.data('address');
            var email = button.data('email');
            var email2 = button.data('email2');
            var work = button.data('work');
            var mobile = button.data('mobile');

            var modal = $(this);
            modal.find('#modal-firstname').text(firstname);
            modal.find('#modal-lastname').text(lastname);
            modal.find('#modal-address').text(address);
            modal.find('#modal-email').text(email);
            modal.find('#modal-email2').text(email2);
            modal.find('#modal-work').text(work);
            modal.find('#modal-mobile').text(mobile);
        });

        function copyToClipboard() {
            var textarea = document.getElementById("modal-address");
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            document.execCommand("copy");
            var copyButton = document.getElementById("copy-btn");
            copyButton.innerText = "Copied";
            setTimeout(function() {
                copyButton.innerText = "Copy";
            }, 2000);
        }


        // Modal edit contact
        $('#editContactModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var id = button.data('id');
            var firstname = button.data('firstname');
            var lastname = button.data('lastname');
            var address = button.data('address');
            var email = button.data('email');
            var email2 = button.data('email2');
            var work = button.data('work');
            var mobile = button.data('mobile');

            var modal = $(this);
            modal.find('#editContactID').val(id);
            modal.find('#editContactService').val(firstname);
            modal.find('#editContactName').val(lastname);
            modal.find('#editContactAddress').val(address);
            modal.find('#editContactEmail').val(email);
            modal.find('#editContactEmail2').val(email2);
            modal.find('#editContactWork').val(work);
            modal.find('#editContactMobile').val(mobile);
        });

        // Save contact
        $('#saveChanges').on('click', function() {
            var id = $('#editContactID').val();
            var firstname = $('#editContactService').val();
            var lastname = $('#editContactName').val();
            var address = $('#editContactAddress').val();
            var email = $('#editContactEmail').val();
            var email2 = $('#editContactEmail2').val();
            var work = $('#editContactWork').val();
            var mobile = $('#editContactMobile').val();

            var dataToSend = {
                id: id,
                firstname: firstname,
                lastname: lastname,
                address: address,
                email: email,
                email2: email2,
                work: work,
                mobile: mobile
            };

            var jsonData = JSON.stringify(dataToSend);
            console.log("JSON Data:", jsonData);
            $.ajax({
                    url: '/contact/' + id,
                    type: 'PUT',
                    contentType: 'application/json',
                    data: jsonData,
                    success: function(response) {
                        console.log("Response:", response);
                        const name = response.name || "Contact";
                        $("#updateSuccessAlert").text(name + " Contact changed successfully!").removeClass('d-none');
                        setTimeout(function() {
                            $("#updateSuccessAlert").addClass('d-none');
                            location.reload();
                        }, 2000);
                    },
                    error: function(xhr, status, error) {
                        alert('Error updating contact.');
                    }
                });
            });


        // Modal delete contact
        var contactID;
        $('#deleteContactModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            contactID = button.data('id');
            var lastname = button.data('lastname');
            $('#deleteContactName').text(lastname);
        });

        $('#confirmDelContact').on('click', function() {
            $.ajax({
                url: '/contact/' + contactID,
                type: 'DELETE',
                success: function(response) {
                    $('#contactRow_' + contactID).remove();
                    location.reload();
                },
                error: function(error) {
                    alert('Failed delete contact.');
                    }
                });
            });


        // Modal add escalation procedure
        $('#addEsclModal').on('show.bs.modal', function (event) {
            $('#addEsclName').val('');
            $('#addEsclPDF').val('');
        });

        $('#saveNewEscl').on('click', function() {
            var addEsclName = $('#addEsclName').val();
            var addEsclPDF = $('#addEsclPDF')[0].files[0];

            if (!addEsclName) {
                alert("Escalation name is required.");
                return;
            }
            if (!addEsclPDF) {
            alert("PDF file is required.");
            return;
            }

            var formData = new FormData();
            formData.append('title', addEsclName);
            formData.append('pdf', addEsclPDF);

            $.ajax({
                url: '/escalation',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    $("#esclSuccessAlert").text(name + " Escalation table added successfully!").removeClass('d-none');
                    setTimeout(function() {
                        $("#esclSuccessAlert").addClass('d-none');
                        location.reload();
                    }, 2000);
                },
                error: function(xhr, status, error) {
                    console.log('Error status: ', status);
                    console.log('Error response: ', xhr.responseJSON);
                    alert('An error occurred while adding the escalation. Please try again.\n' + xhr.responseJSON.error);
                }
            });
        });


        // Modal edit escalation procedure
        $('#editEscalationModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var id = button.data('id');
                var title = button.data('title');
                var pdfPath = button.data('pdf');
                
                var modal = $(this);
                modal.find('#editEsclID').val(id);
                modal.find('#editEsclTitle').val(title);
                modal.find('#currentPDFLink').attr('href', pdfPath);
            });

        $('#saveEsclChanges').on('click', function() {
            var id = $('#editEsclID').val();
            var title = $('#editEsclTitle').val();
            // var pdfPath = $('#currentPDFLink').val();

            var formData = new FormData();
            formData.append("id", id);
            formData.append("title", title);

            // Jika file PDF baru diupload, tambahkan ke FormData
            var fileInput = $('#editEsclPDF')[0];
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                formData.append("pdf", fileInput.files[0]);
            }
            
            // Send AJAX request to update escalation
            $.ajax({
                url: '/escalation/' + id,
                type: 'PUT',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    console.log("Response from server:", response);
                    alert("Escalation updated successfully");
                    $('#currentPDFLink').attr('href', '/files/pdfs/' + response.pdf + '?v=' + new Date().getTime());
                    $('#currentPDFLink').text(response.pdf);
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.log("Error:", error);
                    console.log("Status:", status);
                    console.log("Response:", xhr.responseText);
                    alert("Failed to update escalation.");
                }
            });
        });


        // Modal delete escalation procedure
        var esclID;

        $('#deleteEscalationModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            esclID = button.data('id');
            var title = button.data('title');

            $('#deleteEscalName').text(title);
        });

        $('#confirmDelEscal').on('click', function() {
            $.ajax({
                url: '/escalation/' + esclID,
                type: 'DELETE',
                success: function(response) {
                    console.log('Delete Response:', response);
                    if (response && response.message === 'Deleted successfully') {
                        location.reload();
                    } else {
                        alert('Failed to delete escalation.');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    alert('Failed delete escal.');
                    }
                });
            });

        // Modal edit extention phone
        $('#editExtModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var id = button.data('id');
            var divName = button.data('divname');
            var name = button.data('name');
            var ext = button.data('extphone');

            console.log("Divisi yang akan disetel:", divName);
            
            var modal = $(this);
            modal.find('#editExtID').val(id);
            modal.find('#editExtName').val(name);
            modal.find('#editExtPhone').val(ext);

            $.ajax({
                url: '/divisions',
                type: 'GET',
                success: function(response) {
                    console.log("Response data:", response);
                    var divisiSelect = modal.find('#editExtDiv');
                    divisiSelect.empty();
                    divisiSelect.append('<option value="" disabled selected>Select Division</option>');
                    
                    response.divisions.forEach(function(divisi) {
                        var isSelected = divisi === divName ? 'selected' : '';
                        divisiSelect.append('<option value="' + divisi +'" ' + isSelected + '>' + divisi + '</option>');
                    });
                    
                    if (divName) {
                        divisiSelect.val(divName);
                    } else {
                        divisiSelect.val('');
                    }
                },
                error: function(xhr, status, error) {
                    console.log("Error:", error);
                    alert("Failed to fetch divisions.");
                }
            });
        });

        // Save extention phone
        $('#saveExtChanges').on('click', function() {
            var formData = {
                id: $('#editExtID').val(),
                div_name: $('#editExtDiv').val(),
                name: $('#editExtName').val(),
                ext_phone: $('#editExtPhone').val(),

            };

            console.log("Form data to be sent:", formData);

            $.ajax({
                url: '/extention/' + formData.id,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                    console.log("Response from server:", response);
                    alert("Extention phone updated successfully.");
                    $('#editExtModal').modal('hide');
                    location.reload();
                },
                error: function(xhr, status, error) {
                    console.error("Error:", error);
                    alert("Failed to update extention phone.");
                }
            });
        });
    });
</script>
$(document).ready(function() {
            console.log("main.js loaded successfully!");
            console.log("DOM is fully loaded!");

            $('#sidebarCollapse').on('click', function(){
                $('#sidebar').toggleClass('collapsed');
                $('#content').toggleClass('expanded');
            });
    
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
                    if (targetHref === '/auth/contact') {
                        window.location.href = '/auth/contact';
                    } else if (targetHref === '/auth/escalation') {
                        window.location.href = '/auth/escalation';
                        } else if (targetHref === '/auth/extention') {
                            window.location.href = '/auth/extention';
                        } else if (targetHref === '/auth/user') {
                            window.location.href = '/auth/user';
                        } else if (targetHref === '/auth/cid') {
                            window.location.href = '/auth/cid';
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
                var isValid = true;

                var firstname = $('#addContactFirstName').val();
                var lastname = $('#addContactLastName').val();
                var address = $('#addContactAddress').val();
                var email = $('#addContactEmail').val();
                var email2 = $('#addContactEmail2').val();
                var work = $('#addContactWork').val();
                var mobile = $('#addContactMobile').val();
    
                $('#addContactForm input, #addContactForm textarea').each(function () {
                    $(this).removeClass('is-invalid');
                });

                $('#addContactForm input[required], #addContactForm textarea[required]').each(function () {
                    if ($(this).val().trim() === '') {
                        isValid = false;
                        $(this).addClass('is-invalid');
                        $(this).siblings('.invalid-feedback').show();
                    } else {
                        $(this).removeClass('is-invalid');
                        $(this).siblings('.invalid-feedback').hide();
                    }
                });

                if (!isValid) {
                    return;
                }

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
                        }, 500);
                        $('#addContactForm')[0].reset();
    
                    },
                    error: function(error) {
                        console.error("Error:", error);
                        alert("An error occurred while adding a contact.");
                    }
                    });
                });
    
    
            // Modal view contact
            $(document).on('click', '[data-target="#viewContactModal"]', function (event) {
                console.log("View button clicked!");

                var button = $(this);
                console.log("Button:", button);

                var firstname = button.data('firstname');
                var lastname = button.data('lastname');
                var address = button.data('address');
                var email = button.data('email');
                var email2 = button.data('email2');
                var work = button.data('work');
                var mobile = button.data('mobile');
    
                var modal = $('#viewContactModal');
                console.log("Modal:", modal);

                modal.find('#modal-firstname').text(firstname);
                modal.find('#modal-lastname').text(lastname);
                modal.find('#modal-address').val(address);
                modal.find('#modal-email').text(email);
                modal.find('#modal-email2').text(email2);
                modal.find('#modal-work').text(work);
                modal.find('#modal-mobile').text(mobile);
            });
    

            $('#copy-btn').on('click', function() {
                var textarea = document.getElementById("modal-address");

                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);

                navigator.clipboard.writeText(textarea.value)
                .then(function() {

                    var copyButton = document.getElementById("copy-btn");
                    copyButton.innerText = "Copied";
                    setTimeout(function() {
                        copyButton.innerText = "Copy";
                    }, 2000);
                })
                .catch(function(err) {
                    console.error("Failed to copy: ", err);
                    alert("Failed to copy text to clipboard. Please try again.");
                });

            });

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
                            }, 500);
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
                $('#addEsclForm input').removeClass('is-invalid');
                $('#addEsclForm .invalid-feedback').hide();
            });
    
            $('#saveNewEscl').on('click', function() {
                var isValid = true;

                var addEsclName = $('#addEsclName').val();
                var addEsclPDF = $('#addEsclPDF')[0].files[0];

                $('#addEsclForm input').removeClass('is-invalid');
                $('#addEsclForm .invalid-feedback').hide();

                $('#addEsclForm input[required]').each(function () {
                    if ($(this).val().trim() === '') {
                        isValid = false;
                        $(this).addClass('is-invalid');
                        $(this).siblings('.invalid-feedback').show();
                    }
                });

                // Validasi file input (PDF saja)
                if (!addEsclPDF) {
                    isValid = false;
                    $('#addEsclPDF').addClass('is-invalid');
                    $('#addEsclPDF').siblings('.invalid-feedback').text('File PDF harus diunggah.').show();
                } else if (addEsclPDF.type !== 'application/pdf') {
                    isValid = false;
                    $('#addEsclPDF').addClass('is-invalid');
                    $('#addEsclPDF').siblings('.invalid-feedback').text('File harus berformat PDF.').show();
                }

                if (!isValid) {
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
                        }, 500);
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
    
                var formData = new FormData();
                formData.append("id", id);
                formData.append("title", title);
    
                // Jika file PDF baru diupload, tambahkan ke FormData
                var fileInput = $('#editEsclPDF')[0];
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    formData.append("pdf", fileInput.files[0]);
                }
                
                $.ajax({
                    url: '/escalation/' + id,
                    type: 'PUT',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        $("#esclEdSuccessAlert").text(name + " Escalation changed successfully!").removeClass('d-none');
                        setTimeout(function() {
                            $("#esclEdSuccessAlert").addClass('d-none');
                            $('#currentPDFLink').attr('href', '/files/pdfs/' + response.pdf + '?v=' + new Date().getTime());
                            $('#currentPDFLink').text(response.pdf);
                            location.reload();
                        }, 500);
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
    
            // Modal add extention phone
            $('#addExtPhoneModal').on('show.bs.modal', function (event) {
                $('#addDivName').val('');
                $('#addStafName').val('');
                $('#addExtPhone').val('');
            });

            $('#saveNewExtPhone').on('click', function() {
                var isValid = true;

                var divName = $('#addDivName').val();
                var name = $('#addStafName').val();
                var extPhone = $('#addExtPhone').val();

                $('#addExtPhoneForm input').each(function () {
                    $(this).removeClass('is-invalid');
                });

                $('#addExtPhoneForm input[required]').each(function () {
                    if ($(this).val().trim() === '') {
                        isValid = false;
                        $(this).addClass('is-invalid');
                        $(this).siblings('.invalid-feedback').show();
                    } else {
                        $(this).removeClass('is-invalid');
                        $(this).siblings('.invalid-feedback').hide();
                    }
                });

                if (!isValid) {
                    return;
                }

                var dataToSend = {
                    div_name: divName,
                    name: name,
                    ext_phone: extPhone
                };

                var jsonData = JSON.stringify(dataToSend);
                console.log("JSON Data:", jsonData);

                $.ajax({
                    url: '/extention',
                    type: 'POST',
                    contentType: 'application/json',
                    data: jsonData,
                    success: function(response) {
                        $("#successAlertExtPhone").text(name + " Extention phone added successfully!").removeClass('d-none');
                        setTimeout(function() {
                            $("#successAlertExtPhone").addClass('d-none');
                        }, 500);
                        $('#addExtPhoneForm')[0].reset();
                    },
                    error: function(error) {
                        console.error("Error:", error);
                        alert("An error occurred while adding a extention phone.");
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
                        $("#successAlertEdExtPhone").text(name + " Extention phone changed successfully!").removeClass('d-none');
                        setTimeout(function() {
                            $("#successAlertEdExtPhone").addClass('d-none');
                            location.reload();
                        }, 500);
                    },
                    error: function(xhr, status, error) {
                        console.error("Error:", error);
                        alert("Failed to update extention phone.");
                    }
                });
            });
    
    
            // Delete extention phone
            var extID;
    
            $('#deleteExtModal').on('show.bs.modal', function(event) {
                var button = $(event.relatedTarget);
                extID = button.data('id');
                var ext = button.data('extphone');
                
                $('#deleteExtPhone').text(ext);
            });
    
            $('#confirmDelExtPhone').on('click', function() {
                $.ajax({
                    url: '/extention/' + extID,
                    type: 'DELETE',
                    success: function(response) {
                        if (response && response.message === 'Deleted successfully') {
                            location.reload();
                        } else {
                            alert('Failed to delete escalation.');
                        }
                    },
                    error: function(error) {
                        alert('Failed delete contact.');
                        }
                    });
                });

            // Modal add user
            $('#addUserModal').on('show.bs.modal', function (event) {
                $('#username').val('');
                $('#password').val('');
            });
    
            $('#addUserForm').on('submit', function (event) {
                event.preventDefault();

                var isValid = true;

                var username = $('#username').val();
                var password = $('#password').val();
    
                $('#addUserForm input').each(function () {
                    $(this).removeClass('is-invalid');
                });

                $('#addUserForm input[required]').each(function () {
                    if ($(this).val().trim() === '') {
                        isValid = false;
                        $(this).addClass('is-invalid');
                        $(this).siblings('.invalid-feedback').show();
                    } else {
                        $(this).removeClass('is-invalid');
                        $(this).siblings('.invalid-feedback').hide();
                    }
                });

                // Validasi username
                if (username.trim() === '') {
                    isValid = false;
                    $('#username').addClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').text('Username is required.').show();
                } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
                    isValid = false;
                    $('#username').addClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').text('Username must contain only letters and numbers.').show();
                } else {
                    $('#username').removeClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').hide();
                }


                // Validasi password
                if (password.trim() === '') {
                    isValid = false;
                    $('#password').addClass('is-invalid');
                    $('#password').siblings('.invalid-feedback').text('Password is required.').show();
                } else if (password.length < 6) {
                    isValid = false;
                    $('#password').addClass('is-invalid');
                    $('#password').siblings('.invalid-feedback').text('Password must be at least 6 characters long.').show();
                } else {
                    $('#password').removeClass('is-invalid');
                    $('#password').siblings('.invalid-feedback').hide();
                }


                if (!isValid) {
                    return;
                }

                var dataToSend = {
                    username: username,
                    password: password
                };
    
                var jsonData = JSON.stringify(dataToSend);

                console.log("JSON Data:", jsonData);
    
                $.ajax({
                    url: '/user',
                    type: 'POST',
                    contentType: 'application/json',
                    data: jsonData,
                    success: function(response) {
                        $("#successAlertAddUser").text(response.username + " User added successfully!").removeClass('d-none');
                        setTimeout(function() {
                            $("#successAlertAddUser").addClass('d-none');
                            location.reload();
                        }, 500);
                    },
                    error: function(error) {
                        if (error.status === 409) {
                            $('#username').addClass('is-invalid');
                            $('#username').siblings('.invalid-feedback').text('Username already exists!').show();
                            } else {
                                alert("An error occurred while adding a user.");
                            }
                        }
                    });
                });

                // Handle Enter keypress event
                $('#addUserForm').on('keypress', function(event) {
                    if (event.which === 13) {
                        event.preventDefault();
                        $(this).submit();
                    }
                });


                // Delete user
                var id;
    
                $('#deleteUserModal').on('show.bs.modal', function(event) {
                    var button = $(event.relatedTarget);
                    id = button.data('id');
                    
                    $('#deleteUser').text(username);
                });

                $('#confirmDelUser').on('click', function() {
                    $.ajax({
                        url: '/user/' + id,
                        type: 'DELETE',
                        success: function(response) {
                            if (response && response.message === 'Deleted successfully') {
                                location.reload();
                            } else {
                                alert('Failed to delete user.');
                            }
                        },
                        error: function(error) {
                            if (error.responseJSON && error.responseJSON.error) {
                                    alert(error.responseJSON.error);
                                } else {
                                    alert('Failed to delete user.');
                                }
                            }
                        });
                    });


                // Reset password
                $('#resetPasswordModal').on('show.bs.modal', function(event) {
                    var button = $(event.relatedTarget);
                    var userId = button.data('id');

                    console.log('Modal Opened. User ID:', userId);

                    $('#resetUserId').val(userId);

                });

                $('#resetPasswordForm').on('submit', function (event) {
                    event.preventDefault();

                    var isValid = true;

                    var id = $('#resetUserId').val();
                    var password = $('#newPassword').val();

                    console.log('Password Input Value:', password);
        
                    $('#resetPasswordForm input').each(function () {
                        $(this).removeClass('is-invalid');
                    });

                    // Validasi input password
                    if (!password || password.trim() === '') {
                        isValid = false;
                        $('#newPassword').addClass('is-invalid');
                        $('#newPassword').siblings('.invalid-feedback').show();
                    } else {
                        $('#newPassword').removeClass('is-invalid');
                        $('#newPassword').siblings('.invalid-feedback').hide();
                    }

                    if (!isValid) {
                        console.error('Validation failed! Password is required.');
                        return;
                    }

                    var dataToSend = {
                        password: password
                    };
    
                    var jsonData = JSON.stringify(dataToSend);
                    console.log("JSON Data:", jsonData);

                    $.ajax({
                        url: '/user/reset-password/' + id,
                        type: 'PUT',
                        contentType: 'application/json',
                        data: jsonData,
                        success: function(response) {
                            console.log('Password reset successful:', response);
                            $("#successAlertResetPassword").text("Reset password Successfully!").removeClass('d-none');

                            setTimeout(function() {
                                $("#successAlertResetPassword").addClass('d-none');
                                location.reload();
                            }, 500);
                        },
                        error: function(error) {
                            console.error('Error resetting password:', error);
                            alert('Error resetting password.');
                        }
                    });
                });

                // Handle Enter keypress event
                $('#confirmResetPassword').on('keypress', function(event) {
                    if (event.which === 13) {
                        event.preventDefault();
                        $(this).submit();
                    }
                });

            document.getElementById('logoutText').addEventListener('click', function() {
                $('#confirmLogoutModal').modal('show');
            });

            document.getElementById('confirmLogoutButton').addEventListener('click', function () {
            fetch('/logout', { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Logout successful') {
                        $('#confirmLogoutModal').modal('hide');

                        const alertBox = document.getElementById('logoutAlert');
                        alertBox.classList.remove('d-none');
                        setTimeout(() => {
                            alertBox.classList.add('d-none');
                            window.location.href = '/';
                        }, 500);
                    }
                })
                .catch(err => {
                    console.error('Logout failed:', err);
                });
            });

        });

function getSessionStatus() {
    fetch('/session-status')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                var currentUser = data.username;
                
                $('tbody tr').each(function() {
                    var username = $(this).find('td').eq(0).text().trim();
                    var deleteButton = $(this).find('.btn-danger');
                    var resetButton = $(this).find('.btn-warning');

                    if (currentUser === "dee2") {
                        if (username === "dee2") {
                            resetButton.prop('disabled', false);
                            deleteButton.prop('disabled', true);
                        } else {
                            // Untuk user selain "dee2"
                            resetButton.prop('disabled', false);
                            deleteButton.prop('disabled', false);
                        }
                    } else {
                        if (username === "dee2") {
                            resetButton.prop('disabled', true);
                            deleteButton.prop('disabled', true);
                        } else {
                            resetButton.prop('disabled', false);
                            deleteButton.prop('disabled', false);
                        }
                    }
                });
            } else {
                console.log("User not logged in.");
            }
        })
        .catch(error => {
            console.error("Error fetching session status:", error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    getSessionStatus();
});

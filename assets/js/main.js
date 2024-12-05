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
                        } else if (targetHref === '/auth/bankdata') {
                            window.location.href = '/auth/bankdata';
                        }
                    });
                });
    
            $('#addContactModal').on('show.bs.modal', function (event) {
                $('#addContactFirstName').val('');
                $('#addContactLastName').val('');
                $('#addContactAddress').val('');
                $('#addContactEmail').val('');
                $('#addContactEmail2').val('');
                $('#addContactWork').val('');
                $('#addContactMobile').val('');
            });
    
            $('#saveNewContact').on('click', function(e) {
                e.preventDefault();

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

                $('#saveNewContact').on('keypress', function(event) {
                    if (event.which === 13) {
                        event.preventDefault();
                        $(this).submit();
                    }
                });

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
    
            $('#addEsclModal').on('show.bs.modal', function () {
                $('#addEsclName').val('');
                $('#addEsclPDF').val('');
                $('#addEsclForm input').removeClass('is-invalid');
                $('.invalid-feedback').hide();

            });
    
            $('#saveNewEscl').on('click', function(e) {
                e.preventDefault();

                var isValid = true;

                var addEsclName = $('#addEsclName').val();
                var addEsclPDF = $('#addEsclPDF')[0].files[0];

                $('#addEsclForm input').each(function () {
                    $(this).removeClass('is-invalid');
                    $(this).siblings('.invalid-feedback').hide();
                });

                $('#addEsclForm input[required]').each(function () {
                    if ($(this).val().trim() === '') {
                        isValid = false;
                        $(this).addClass('is-invalid');
                        $(this).siblings('.invalid-feedback').show();
                    }
                });

                if (!addEsclName || addEsclName.trim() === '') {
                    isValid = false;
                    $('#addEsclName').addClass('is-invalid');
                    $('#addEsclName').siblings('.invalid-feedback').show();
                }

                if (!addEsclPDF) {
                    isValid = false;
                    $('#addEsclPDF').addClass('is-invalid');
                    $('#addEsclPDF').siblings('.invalid-feedback').show();
                } else {

                    if (addEsclPDF.type !== 'application/pdf') {
                        isValid = false;
                        $('#addEsclPDF').addClass('is-invalid');
                        $('#addEsclPDF').siblings('.invalid-feedback').show();
                    }

                    if (addEsclPDF.size > 2 * 1024 * 1024) {
                        isValid = false;
                        $('#addEsclPDF').addClass('is-invalid');
                        $('#addEsclPDF').siblings('.invalid-feedback').show();
                    }
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
                    success: function() {
                        $("#esclSuccessAlert").removeClass('d-none');
                        setTimeout(function() {
                            $("#esclSuccessAlert").addClass('d-none');
                            location.reload();
                        }, 500);
                    },
                    error: function(xhr, status) {
                        console.log('Error status: ', status);
                        console.log('Error response: ', xhr.responseJSON);
                        alert('An error occurred while adding the escalation. Please try again.\n' + xhr.responseJSON.error);
                    }
                });
            });

            $('#saveNewEscl').on('keypress', function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(this).submit();
                }
            });

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
    
            $('#saveEsclChanges').on('click', function(e) {
                e.preventDefault();

                var isValid = true;

                var id = $('#editEsclID').val();
                var title = $('#editEsclTitle').val();
                var fileInput = $('#editEsclPDF')[0];

                $('#editEsclForm input').each(function () {
                    $(this).removeClass('is-invalid');
                    $(this).siblings('.invalid-feedback').hide();
                });

                if (title.trim() === '') {
                    isValid = false;
                    $('#editEsclTitle').addClass('is-invalid');
                    $('#editEsclTitle').siblings('.invalid-feedback').show();
                }

                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    var file = fileInput.files[0];

                    var maxSize = 2* 1024 * 1024;
                    if (file.size > maxSize) {
                        isValid = false;
                        $('#editEsclPDF').addClass('is-invalid');
                        $('#editEsclPDF').siblings('.invalid-feedback').text('File must be less than 2MB.').show();
                    }

                    var fileExtension = file.name.split('.').pop().toLowerCase();
                    if (fileExtension !== 'pdf') {
                        isValid = false;
                        $('#editEsclPDF').addClass('is-invalid');
                        $('#editEsclPDF').siblings('.invalid-feedback').text('File must be in PDF format.').show();
                    }
                }

                if (!isValid) {
                    return;
                }

                var formData = new FormData();
                formData.append("id", id);
                formData.append("title", title);
    
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
                        $("#esclEdSuccessAlert").text("Data changed successfully!").removeClass('d-none');
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

            $('#saveEsclChanges').on('keypress', function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(this).submit();
                }
            });
    
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

            $('#addBdtModal').on('show.bs.modal', function () {
                $('#addBdtTitle').val('');
                $('#addBdtUploadFile').val('');
                $('#addBdtForm input').removeClass('is-invalid');
                $('.invalid-feedback').hide();

            });
    
            $('#saveNewData').on('click', function(e) {
                e.preventDefault();

                var isValid = true;

                var addBdtTitle = $('#addBdtTitle').val();
                var addBdtUploadFile = $('#addBdtUploadFile')[0].files[0];

                $('#addBdtForm input').each(function () {
                    $(this).removeClass('is-invalid');
                    $(this).siblings('.invalid-feedback').hide();
                });

                $('#addBdtForm input[required]').each(function () {
                    if ($(this).val().trim() === '') {
                        isValid = false;
                        $(this).addClass('is-invalid');
                        $(this).siblings('.invalid-feedback').show();
                    }
                });

                if (!addBdtTitle || addBdtTitle.trim() === '') {
                    isValid = false;
                    $('#addBdtTitle').addClass('is-invalid');
                    $('#addBdtTitle').siblings('.invalid-feedback').show();
                } 

                if (!addBdtUploadFile) {
                    isValid = false;
                    $('#addBdtUploadFile').addClass('is-invalid');
                    $('#addBdtUploadFile').siblings('.invalid-feedback').show();
                } else {
                    var allowedExtensions = ['.pdf', '.xlsx', '.docx', '.txt'];
                    var fileName  = addBdtUploadFile.name.toLowerCase();
                    var fileExtension = fileName.substring(fileName.lastIndexOf('.'));

                    if (!allowedExtensions.includes(fileExtension)) {
                        isValid = false;
                        $('#addBdtUploadFile').addClass('is-invalid');
                        $('#addBdtUploadFile').siblings('.invalid-feedback').text('File must be in PDF, DOCX, XLSX, or TXT format.').show();

                    } else if (addBdtUploadFile.size > 2 * 1024 * 1024) {
                        isValid = false;
                        $('#addBdtUploadFile').addClass('is-invalid');
                        $('#addBdtUploadFile').siblings('.invalid-feedback').text('File must be less than 2MB.').show();
                    }
                }

                if (!isValid) {
                    return;
                }
    
                var formData = new FormData();
                formData.append('title', addBdtTitle);
                formData.append('file', addBdtUploadFile);
    
                $.ajax({
                    url: '/bankdata',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        $("#bdtSuccessAlert").text("Record added successfully!").removeClass('d-none');
                        $('#addBdtForm').modal('hide');
                        
                        setTimeout(function() {
                            location.reload();
                        }, 500);
                    },
                    error: function(xhr, status, error) {
                        console.log('Error status: ', status);
                        console.log('Error response: ', xhr.responseJSON);
                        alert('An error occurred while adding data. Please try again.\n' + xhr.responseJSON.error);
                    }
                });
            });

            $('#saveNewData').on('keypress', function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(this).submit();
                }
            });

            $('#editBdtModal').on('show.bs.modal', function (event) {
                    var button = $(event.relatedTarget);
                    var id = button.data('id');
                    var title = button.data('title');
                    var fileUploadPath  = button.data('fileupload');

                    console.log("File path for modal:", fileUploadPath);
                    
                    var modal = $(this);
                    modal.find('#editBdtlID').val(id);
                    modal.find('#editBdtTitle').val(title);

                    // modal.find('#currentFileLink').off('click').on('click', function () {
                    //     handleFileViewOtEx(fileUploadPath);
                    // });

                });

            $('#saveBdtChanges').on('click', function(e) {
                e.preventDefault();

                var isValid = true;

                var id = $('#editBdtlID').val();
                var title = $('#editBdtTitle').val();
                var fileInput = $('#bdtEdUploadFile')[0];

                $('#editBdtForm input').each(function () {
                    $(this).removeClass('is-invalid');
                    $(this).siblings('.invalid-feedback').hide();
                });

                if (title.trim() === '') {
                    isValid = false;
                    $('#editBdtTitle').addClass('is-invalid');
                    $('#editBdtTitle').siblings('.invalid-feedback').show();
                }

                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    var file = fileInput.files[0];

                    var maxSize = 2* 1024 * 1024;
                    if (file.size > maxSize) {
                        isValid = false;
                        $('#bdtEdUploadFile').addClass('is-invalid');
                        $('#bdtEdUploadFile').siblings('.invalid-feedback').text('File must be less than 2MB.').show();
                    }

                    var fileExtension = file.name.split('.').pop().toLowerCase();
                    if (fileExtension !== 'pdf' && fileExtension !== 'docx' && fileExtension !== 'xlsx' && fileExtension !== 'txt') {
                        isValid = false;
                        $('#bdtEdUploadFile').addClass('is-invalid');
                        $('#bdtEdUploadFile').siblings('.invalid-feedback').text('File must be in PDF, DOCX, XLSX, or TXT format.').show();
                    }
                }

                if (!isValid) {
                    return;
                }
    
                var formData = new FormData();
                formData.append("id", id);
                formData.append("title", title);
    
                var fileInput = $('#bdtEdUploadFile')[0];
                if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    formData.append("fileupload", fileInput.files[0]);
                }

                
                $.ajax({
                    url: '/bankdata/' + id,
                    type: 'PUT',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        $("#bdtEdSuccessAlert").text("Data changed successfully!").removeClass('d-none');
                        setTimeout(function() {
                            $("#bdtEdSuccessAlert").addClass('d-none');
                            location.reload();
                        }, 500);
                    },
                    error: function(xhr, status, error) {
                        console.log("Error:", error);
                        console.log("Status:", status);
                        console.log("Response:", xhr.responseText);
                        alert("Failed to update data.");
                    }
                });
            });

            $('#saveBdtChanges').on('keypress', function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(this).submit();
                }
            });

            var bdtID;
    
            $('#deleteBdtModal').on('show.bs.modal', function(event) {
                var button = $(event.relatedTarget);
                bdtID = button.data('id');
                var title = button.data('title');
    
                $('#deleteBdtName').text(title);
            });
    
            $('#confirmDelBdt').on('click', function() {
                $.ajax({
                    url: '/bankdata/' + bdtID,
                    type: 'DELETE',
                    success: function(response) {
                        console.log('Delete Response:', response);
                        if (response && response.message === 'Deleted successfully') {
                            location.reload();
                        } else {
                            alert('Failed to delete data.');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', error);
                        alert('Failed delete data.');
                        }
                    });
                });

            $('#addExtPhoneModal').on('show.bs.modal', function () {
                $('#addDivName').val('');
                $('#addStafName').val('');
                $('#addExtPhone').val('');
            });

            $('#saveNewExtPhone').on('click', function(e) {
                e.preventDefault();

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

            $('#saveNewExtPhone').on('keypress', function(event) {
                if (event.which === 13) {
                    event.preventDefault();
                    $(this).submit();
                }
            });

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

            $('#addUserModal').on('show.bs.modal', function () {
                $('#username').val('');
                $('#password').val('');
            });
    
            $('#saveNewUser').on('click', function (e) {
                e.preventDefault();

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
                    }
                });

                if (username.trim() === '') {
                    isValid = false;
                    $('#username').addClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').show();
                } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
                    isValid = false;
                    $('#username').addClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').show();
                } else {
                    $('#username').removeClass('is-invalid');
                    $('#username').siblings('.invalid-feedback').hide();
                }

                if (password.trim() === '') {
                    isValid = false;
                    $('#password').addClass('is-invalid');
                    $('#password').siblings('.invalid-feedback').show();
                } else if (password.length < 6) {
                    isValid = false;
                    $('#password').addClass('is-invalid');
                    $('#password').siblings('.invalid-feedback').show();
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

                $('#saveNewUser').on('keypress', function(event) {
                    if (event.which === 13) {
                        event.preventDefault();
                        $(this).submit();
                    }
                });

                var id;
    
                $('#deleteUserModal').on('show.bs.modal', function(event) {
                    var button = $(event.relatedTarget);
                    id = button.data('id');
                    var username = button.data('username');
                    
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
                    var deleteButton = $(this).find('.btn-reset');
                    var resetButton = $(this).find('.btn-delete');

                    if (currentUser === "dee2") {
                        if (username === "dee2") {
                            resetButton.prop('disabled', true);
                            deleteButton.prop('disabled', false);
                        } else {
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

$('#fileContentModal').on('hidden.bs.modal', function () {
    $('#fileContentModalBody').empty();
})

function handleFileView(filePath) {

    const basePath = "/files/uploads/";

    console.log("File path received:", filePath);

    let cleanFilePath  = filePath.trim();

    if (!cleanFilePath || cleanFilePath === "") {
        alert("File path is not available!");
        return;
    }

    const fileExtension = filePath.split('.').pop().toLowerCase();

    console.log("Cleaned file path:", filePath);
    console.log("File extension detected:", fileExtension);

    if (!filePath || filePath === "") {
        alert("File path is not available!");
        return;
    }

    if (fileExtension === "pdf") {
        const modalBody = document.getElementById('fileContentModalBody');
        if (modalBody) {
            const pdfIframe = `<iframe src="${basePath + cleanFilePath}" width="100%" height="1000px" frameborder="0" scrolling="no" style="overflow: hidden;"></iframe>`;
            modalBody.innerHTML = pdfIframe;
        } else {
            console.error("Element 'fileContentModalBody' not found!");
        }
        $('#fileContentModal').modal('show');
    } else if (fileExtension === "txt") {
        fetch(basePath + filePath)
            .then(response => response.text())
            .then(content => {

                $('#editBdtModal').modal('hide');
                const contentModalBody = document.getElementById('fileContentModalBody');
                if (contentModalBody) {
                    const sanitizedContent = DOMPurify.sanitize(content);
                    contentModalBody.innerHTML = sanitizedContent;
                } else {
                    console.error("Element 'fileContentModalBody' not found!");
                }
                $('#fileContentModal').modal('show');

            })
            .catch(error => console.error("Error loading file:", error));
    } else if (["docx", "xlsx"].includes(fileExtension)) {
        
        window.location.href = basePath + filePath;
    } else {
        
        alert("Unsupported file type: " + filePath);
    }

}

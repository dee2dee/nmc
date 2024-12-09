package controllers

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"nmc/models"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"html/template"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/microcosm-cc/bluemonday"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func GetAddressBook(c *gin.Context) {
	var addressBooks []models.Addressbook
	var totalContacts int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	if search != "" {
		models.DB.Model(&models.Addressbook{}).Where("firstname LIKE ? OR lastname LIKE ?", "%"+search+"%", "%"+search+"%").
			Count(&totalContacts)

		totalPages := int((totalContacts + 9) / 10)

		if err := models.DB.Where("firstname LIKE ? OR lastname LIKE ?", "%"+search+"%", "%"+search+"%").
			Order("firstname ASC, lastname ASC").
			Offset((page - 1) * 10).
			Limit(10).
			Find(&addressBooks).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed get data contact"})
			return
		}

		message := ""
		if len(addressBooks) == 0 {
			message = "No record!"
		}

		fromEntry := (page-1)*10 + 1
		toEntry := fromEntry + len(addressBooks) - 1

		type AddressBookView struct {
			ID        string
			Firstname template.HTML
			Lastname  template.HTML
			Address   template.HTML
			Email     template.HTML
			Email2    template.HTML
			Work      template.HTML
			Mobile    template.HTML
		}

		var safeAddressBooks []AddressBookView

		for _, t := range addressBooks {
			safeAddressBooks = append(safeAddressBooks, AddressBookView{
				Lastname: template.HTML(t.Lastname),
				Address:  template.HTML(t.Address),
			})
		}

		c.HTML(http.StatusOK, "Address-book", gin.H{
			"title":         "Address Book",
			"addressBooks":  safeAddressBooks,
			"search":        search,
			"currentPage":   page,
			"totalPages":    totalPages,
			"totalContacts": totalContacts,
			"fromEntry":     fromEntry,
			"toEntry":       toEntry,
			"message":       message,
		})
	} else {
		c.HTML(http.StatusOK, "Address-book", gin.H{
			"title":         "Address Book",
			"addressBooks":  []models.Addressbook{},
			"search":        search,
			"currentPage":   0,
			"totalPages":    0,
			"totalContacts": 0,
			"fromEntry":     0,
			"toEntry":       0,
			"message":       "",
		})
	}

}

func GetContact(c *gin.Context) {
	var addressBooks []models.Addressbook
	var totalContacts int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	if search != "" {
		models.DB.Model(&models.Addressbook{}).Where("firstname LIKE ? OR lastname LIKE ?", "%"+search+"%", "%"+search+"%").Count(&totalContacts)

		totalPages := int((totalContacts + 9) / 10)
		if int64(page) > int64(totalPages) {
			page = 0
		}

		if err := models.DB.Where("firstname LIKE ? OR lastname LIKE ?", "%"+search+"%", "%"+search+"%").
			Order("firstname ASC, lastname ASC").
			Offset((page - 1) * 10).
			Limit(10).
			Find(&addressBooks).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed get contact"})
			return
		}

		fromEntry := (page-1)*10 + 1
		toEntry := fromEntry + len(addressBooks) - 1

		c.HTML(http.StatusOK, "Contact", gin.H{
			"title":         "Address Book",
			"addressBooks":  addressBooks,
			"search":        search,
			"currentPage":   page,
			"totalPages":    totalPages,
			"totalContacts": totalContacts,
			"fromEntry":     fromEntry,
			"toEntry":       toEntry,
			"message":       "",
		})
	} else {
		c.HTML(http.StatusOK, "Contact", gin.H{
			"title":         "Address Book",
			"addressBooks":  []models.Addressbook{},
			"search":        search,
			"currentPage":   0,
			"totalPages":    0,
			"totalContacts": 0,
			"fromEntry":     0,
			"toEntry":       0,
			"message":       "",
		})
	}
}

func AddContactAddress(c *gin.Context) {
	var newContactAddress models.Addressbook

	if err := c.ShouldBindJSON(&newContactAddress); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&newContactAddress).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Contact created successfully",
		"name":    newContactAddress.Lastname,
	})
}

func AddUser(c *gin.Context) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingUser models.User
	if err := models.DB.Where("username = ?", newUser.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already exists!"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	newUser.Password = string(hashedPassword)

	if err := models.DB.Create(&newUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create contact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "User added successfully!",
		"username": newUser.Username,
	})
}

func ResetPassword(c *gin.Context) {
	id := c.Param("id")

	var requestData struct {
		Password string `json:"password"`
	}

	if err := c.BindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	newPassword := requestData.Password

	if newPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password is required"})
		return
	}

	var user models.User
	if err := models.DB.Where("id = ?", id).First(&user).Error; err != nil {
		log.Println("User not found for ID:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)
	if err := models.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	log.Println("Reset password request received for ID:", id)

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")

	fmt.Println("Deleting extphone with ID:", id)

	var users models.User
	if err := models.DB.First(&users, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if users.Username == "dee2" {
		c.JSON(http.StatusForbidden, gin.H{"error": "User 'dee2' cannot be deleted"})
		return
	}

	if err := models.DB.Delete(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user account"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func CheckPassword(hashedPassword, plainPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
	return err == nil
}

func AddExtentionPhone(c *gin.Context) {
	var newExtentionPhone models.Extphone

	if err := c.ShouldBindJSON(&newExtentionPhone); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newExtentionPhone.DivName = sanitizeFileName(newExtentionPhone.DivName)
	newExtentionPhone.Name = sanitizeFileName(newExtentionPhone.Name)
	newExtentionPhone.ExtPhone = sanitizePhoneNumber(newExtentionPhone.ExtPhone)

	fmt.Println("New Extention Phone Data:", newExtentionPhone)

	if err := models.DB.Create(&newExtentionPhone).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create extention phone"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "Extention phone added successfully!",
		"div_name":  newExtentionPhone.DivName,
		"name":      newExtentionPhone.Name,
		"ext_phone": newExtentionPhone.ExtPhone,
	})
}

func UpdateContactAddress(c *gin.Context) {
	var addressBooks models.Addressbook

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := models.DB.First(&addressBooks, id).Error; err != nil {
		fmt.Println("Contact with ID", id, "not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	if err := c.ShouldBindJSON(&addressBooks); err != nil {
		fmt.Println("Binding error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Binding error"})
		return
	}

	if err := models.DB.Save(&addressBooks).Error; err != nil {
		fmt.Println("Error while saving contact with ID", id, ":", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update contact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Contact updated successfully",
		"name":    addressBooks.Lastname,
	})
}

func UpdateExtentionPhone(c *gin.Context) {
	var extensions models.Extphone

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := models.DB.First(&extensions, id).Error; err != nil {
		fmt.Println("Extention with ID", id, "not found")
		c.JSON(http.StatusNotFound, gin.H{"error": "Extention not found"})
		return
	}

	if err := c.ShouldBindJSON(&extensions); err != nil {
		fmt.Println("Binding error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Binding error"})
		return
	}

	extensions.Name = sanitizeFileName(extensions.Name)
	extensions.ExtPhone = sanitizePhoneNumber(extensions.ExtPhone)

	if err := models.DB.Save(&extensions).Error; err != nil {
		fmt.Println("Error while saving extention with ID", id, ":", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Extention phone updated successfully",
		"DivName":  extensions.DivName,
		"Name":     extensions.Name,
		"ExtPhone": extensions.ExtPhone,
	})
}

func DeleteContactAddress(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var addressBooks models.Addressbook
	if err := models.DB.First(&addressBooks, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Contact not found"})
		return
	}

	if err := models.DB.Delete(&addressBooks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contact deleted successfully"})
}

func DeleteEscal(c *gin.Context) {
	id := c.Param("id")

	var escalations models.Escalation
	if err := models.DB.First(&escalations, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data not found"})
		return
	}

	filePath := filepath.Join("files/pdfs", escalations.PDF)
	fmt.Println("Attempting to delete file:", filePath)

	if _, err := os.Stat(filePath); err == nil {
		if err := os.Remove(filePath); err != nil {
			fmt.Println("Error removing file:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete the file"})
			return
		}
		fmt.Println("File successfully deleted:", filePath)
	} else {
		fmt.Println("File not found or already deleted:", filePath)
	}

	if err := models.DB.Delete(&escalations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func DeleteExtPhone(c *gin.Context) {
	id := c.Param("id")

	fmt.Println("Deleting extphone with ID:", id)

	var extentions models.Extphone
	if err := models.DB.First(&extentions, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Extention not found"})
		return
	}

	if err := models.DB.Delete(&extentions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete extention phone"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func HomePage(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("username")

	if username != nil {
		c.HTML(http.StatusOK, "Home", gin.H{
			"username": username,
		})
		return
	}

}

func WuCorp1(c *gin.Context) {
	c.HTML(http.StatusOK, "WuCorp1", gin.H{
		"title": "Monitoring Corporate 1",
	})
}

func WuCorp2(c *gin.Context) {
	c.HTML(http.StatusOK, "WuCorp2", gin.H{
		"title": "Monitoring Corporate 2",
	})
}

func HsxFaq(c *gin.Context) {
	c.HTML(http.StatusOK, "HsxFaq", gin.H{
		"title": "HSX FAQ",
	})
}

func HsxTicketService(c *gin.Context) {
	c.HTML(http.StatusOK, "HsxTicketService", gin.H{
		"title": "HSX Ticket Service",
	})
}

func Dashboard(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("username")

	if username == nil {
		c.Redirect(http.StatusFound, "/")
		return
	}

	c.HTML(http.StatusOK, "Dashboard", gin.H{
		"title":    "Dashboard",
		"username": username,
	})
}

func GetUser(c *gin.Context) {
	var users []models.User
	var totalUsers int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	const pageSize = 10
	offset := (page - 1) * pageSize

	query := models.DB.Model(&models.User{})

	if search != "" {
		query = query.Where("username LIKE ?", "%"+search+"%")
	}

	if err := query.Count(&totalUsers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count users"})
		return
	}

	if err := query.Order("username").Offset((offset)).Limit(pageSize).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed fetch data account user"})
		return
	}

	message := ""
	if len(users) == 0 {
		message = "No record!"
	}

	totalPages := int(math.Ceil(float64(totalUsers) / float64(pageSize)))

	c.HTML(http.StatusOK, "User Management", gin.H{
		"title":       "User Management",
		"users":       users,
		"search":      search,
		"currentPage": page,
		"totalPages":  totalPages,
		"message":     message,
	})
}

func GetEscalation(c *gin.Context) {
	var escalations []models.Escalation
	var totalEscalations int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	query := models.DB.Model(&models.Escalation{})

	if search != "" {
		query = query.Where("title LIKE ?", "%"+search+"%")
	}

	query.Count(&totalEscalations)

	totalPages := int((totalEscalations + 9) / 10)
	if page > totalPages {
		page = 1
	}

	if err := query.Order("title ASC").Offset((page - 1) * 10).Limit(10).Find(&escalations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed fetch data escalation"})
		return
	}

	for i := range escalations {
		escalations[i].PDFPath = "/files/pdfs/" + escalations[i].PDF
	}

	message := ""
	if len(escalations) == 0 {
		message = "No record!"
	}

	startIndex := (page-1)*10 + 1
	endIndex := startIndex + len(escalations) - 1
	if endIndex > int(totalEscalations) {
		endIndex = int(totalEscalations)
	}

	c.HTML(http.StatusOK, "Escalation", gin.H{
		"title":        "Escalation Procedure",
		"escalations":  escalations,
		"search":       search,
		"currentPage":  page,
		"totalPages":   totalPages,
		"message":      message,
		"totalEntries": totalEscalations,
		"startIndex":   startIndex,
		"endIndex":     endIndex,
	})
}

func GetEscalProcedure(c *gin.Context) {
	var escalations []models.Escalation
	var totalEscalations int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	query := models.DB.Model(&models.Escalation{})

	if search != "" {
		query = query.Where("title LIKE ?", "%"+search+"%")
	}

	query.Count(&totalEscalations)

	totalPages := int((totalEscalations + 9) / 10)

	if page > totalPages {
		page = 1
	}

	if err := query.Order("title ASC").Offset((page - 1) * 10).Limit(10).Find(&escalations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed fetch data escalation"})
		return
	}

	for i := range escalations {
		escalations[i].PDFPath = "/files/pdfs/" + escalations[i].PDF
	}

	message := ""
	if len(escalations) == 0 {
		message = "No record!"
	}

	startIndex := (page-1)*10 + 1
	endIndex := startIndex + len(escalations) - 1
	if endIndex > int(totalEscalations) {
		endIndex = int(totalEscalations)
	}

	c.HTML(http.StatusOK, "Escalation Procedure", gin.H{
		"title":        "Escalation Procedure",
		"escalations":  escalations,
		"search":       search,
		"currentPage":  page,
		"totalPages":   totalPages,
		"message":      message,
		"totalEntries": totalEscalations,
		"startIndex":   startIndex,
		"endIndex":     endIndex,
	})
}

func AddNewEscalation(c *gin.Context) {
	title := c.PostForm("title")

	file, err := c.FormFile("pdf")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get PDF file"})
		return
	}

	if title == "" || file == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and PDF file are required"})
		return
	}

	if filepath.Ext(file.Filename) != ".pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only PDF files are allowed"})
		return
	}

	if file.Size > 2*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB"})
		return
	}

	sanitizeTitle := sanitizeFileName(title)
	newFileName := fmt.Sprintf("%s%s", strings.ToLower(sanitizeTitle), filepath.Ext(file.Filename))
	filePath := filepath.Join("files/pdfs", newFileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		fmt.Println("Failed to save file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save the file"})
		return
	}

	escalation := models.Escalation{
		Title:   title,
		PDF:     newFileName,
		PDFPath: filePath,
	}

	if err := models.DB.Create(&escalation).Error; err != nil {
		fmt.Println("Failed to save escalation to database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save escalation to database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Escalation added successfully",
		"name":    title,
	})

}

func UpdateEscalation(c *gin.Context) {
	id := c.Param("id")

	var escalation models.Escalation

	if err := models.DB.First(&escalation, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Escalation not found"})
		return
	}

	newTitle := c.PostForm("title")
	oldTitle := escalation.Title
	escalation.Title = newTitle

	sanitizedTitle := sanitizeFileName(strings.ToLower(newTitle))
	newFileName := fmt.Sprintf("%s.pdf", sanitizedTitle)
	newFilePath := filepath.Join("files/pdfs", newFileName)

	oldFileName := fmt.Sprintf("%s.pdf", sanitizeFileName(strings.ToLower(oldTitle)))
	oldFilePath := filepath.Join("files/pdfs", oldFileName)

	fmt.Println("New file path:", newFilePath)
	fmt.Println("Old file path:", oldFilePath)

	if oldFilePath != newFilePath && oldFileName != "" {

		if _, err := os.Stat(oldFilePath); err == nil {

			if err := os.Remove(oldFilePath); err != nil {
				fmt.Println("Error removing old file:", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove old PDF file"})
				return
			} else {
				fmt.Println("Old file deleted successfully:", oldFilePath)
			}
		} else if os.IsNotExist(err) {
			fmt.Println("File not found, skipping delete:", oldFilePath)
		} else {
			fmt.Println("Error checking file existence:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking old file existence"})
			return
		}
	}

	file, err := c.FormFile("pdf")
	if err == nil {

		if err := c.SaveUploadedFile(file, newFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save the file"})
			return
		}

		fmt.Println("New file saved successfully:", newFilePath)

		escalation.PDF = newFileName
	} else if err != http.ErrMissingFile {

		fmt.Println("Error retrieving file from request:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve the file"})
		return
	} else {
		fmt.Println("No new file uploaded, keeping existing PDF:", escalation.PDF)
	}

	if err := models.DB.Save(&escalation).Error; err != nil {
		fmt.Println("Error saving to DB:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update escalation in database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Escalation updated successfully",
		"pdf":     escalation.PDF,
	})
}

func GetDivisions(c *gin.Context) {
	var divisions []string
	if err := models.DB.Model(&models.Extphone{}).Distinct("div_name").Pluck("div_name", &divisions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch divisions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"divisions": divisions,
	})
}

func AddBankdt(c *gin.Context) {
	title := c.PostForm("title")

	file, err := c.FormFile("file")
	if err != nil {
		fmt.Println("Error while processing file:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get file"})
		return
	}

	if title == "" || file == nil {
		fmt.Println("Missing name or file")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and upload file are required"})
		return
	}

	allowedExtensions := []string{".pdf", ".docx", ".xlsx", ".txt"}
	fileExtension := filepath.Ext(file.Filename)
	isValidExtension := false
	for _, ext := range allowedExtensions {
		if fileExtension == ext {
			isValidExtension = true
			break
		}
	}

	if !isValidExtension {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file type. Allowed types: .pdf, .docx, .xlsx, .txt"})
		return
	}

	if file.Size > 2*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB"})
		return
	}

	sanitizedTitle := sanitizeFileName(title)
	newFileName := fmt.Sprintf("%s%s", strings.ToLower(sanitizedTitle), fileExtension)

	filePath := filepath.Join("files/uploads", newFileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		fmt.Println("Failed to save file:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save the file"})
		return
	}

	bankdt := models.Bankdt{
		Title:          title,
		Fileupload:     newFileName,
		FileUploadPath: filePath,
	}

	if err := models.DB.Create(&bankdt).Error; err != nil {
		fmt.Println("Failed to save data to database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file to database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Record added successfully",
		"name":    title,
	})

}

func GetBankdt(c *gin.Context) {
	var bankdts []models.Bankdt
	var totalBankdts int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	query := models.DB.Model(&models.Bankdt{})

	if search != "" {
		query = query.Where("title LIKE ?", "%"+search+"%")
	}

	query.Count(&totalBankdts)

	totalPages := int((totalBankdts + 9) / 10)
	if page > totalPages {
		page = 1
	}

	if err := query.Order("title ASC").Offset((page - 1) * 10).Limit(10).Find(&bankdts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed fetch data"})
		return
	}

	for i := range bankdts {
		bankdts[i].FileUploadPath = "/files/uploads/" + bankdts[i].Fileupload
	}

	message := ""
	if len(bankdts) == 0 {
		message = "No record!"
	}

	startIndex := (page-1)*10 + 1
	endIndex := startIndex + len(bankdts) - 1
	if endIndex > int(totalBankdts) {
		endIndex = int(totalBankdts)
	}

	c.HTML(http.StatusOK, "Bank Data", gin.H{
		"title":        "Bank Data",
		"bankdts":      bankdts,
		"search":       search,
		"currentPage":  page,
		"totalPages":   totalPages,
		"message":      message,
		"totalEntries": totalBankdts,
		"startIndex":   startIndex,
		"endIndex":     endIndex,
	})
}

func sanitizeFileName(title string) string {
	return strings.Map(func(r rune) rune {
		if r == '_' || r == '-' || ('a' <= r && r <= 'z') || ('A' <= r && r <= 'Z') || ('0' <= r && r <= '9') {
			return r
		}
		return '_'
	}, title)
}

func sanitizePhoneNumber(input string) string {
	return strings.Map(func(r rune) rune {
		if r == '-' || r == '+' || r == '/' || ('0' <= r && r <= '9') {
			return r
		}
		return '_'
	}, input)
}

func UpdateBankdt(c *gin.Context) {
	id := c.Param("id")
	var bankdt models.Bankdt

	if err := models.DB.First(&bankdt, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data not found"})
		return
	}

	newTitle := c.PostForm("title")
	if newTitle == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title cannot be empty"})
		return
	}

	bankdt.Title = newTitle

	file, err := c.FormFile("fileupload")
	if err == nil {
		if file.Size > 2*1024*1024 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File size exceeds 2MB"})
			return
		}

		allowedExtensions := []string{".pdf", ".docx", ".xlsx", ".txt"}
		fileExtension := strings.ToLower(filepath.Ext(file.Filename))

		isValid := false
		for _, ext := range allowedExtensions {
			if fileExtension == ext {
				isValid = true
				break
			}
		}

		if !isValid {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file format"})
			return
		}

		sanitizedTitle := sanitizeFileName(newTitle)
		newFileName := fmt.Sprintf("%s%s", strings.ToLower(sanitizedTitle), fileExtension)
		newFilePath := filepath.Join("files/uploads", newFileName)

		if bankdt.Fileupload != "" && bankdt.Fileupload != newFileName {
			oldFilePath := filepath.Join("files/uploads", bankdt.Fileupload)
			if err := os.Remove(oldFilePath); err != nil && !os.IsNotExist(err) {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove old file"})
				return
			}
		}

		if err := c.SaveUploadedFile(file, newFilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save the file"})
			return
		}

		bankdt.Fileupload = newFileName
	}

	if err := models.DB.Save(&bankdt).Error; err != nil {
		fmt.Println("Error saving to DB:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update data in database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Data updated successfully",
		"fileupload": bankdt.Fileupload,
	})
}

func DeleteBankdt(c *gin.Context) {
	id := c.Param("id")

	var bankdts models.Bankdt
	if err := models.DB.First(&bankdts, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data not found"})
		return
	}

	filePath := filepath.Join("files/uploads", bankdts.Fileupload)
	fmt.Println("Attempting to delete file:", filePath)

	if _, err := os.Stat(filePath); err == nil {
		if err := os.Remove(filePath); err != nil {
			fmt.Println("Error removing file:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete the file"})
			return
		}
		fmt.Println("File successfully deleted:", filePath)
	} else {
		fmt.Println("File not found or already deleted:", filePath)
	}

	if err := models.DB.Delete(&bankdts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func GetExtentionPhone(c *gin.Context) {
	var extentions []models.Extphone
	var totalExtentions int64

	search := c.PostForm("search")
	if search == "" {
		search = c.Query("search")
	}

	pageStr := c.Query("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil {
			page = p
		}
	}

	const pageSize = 10
	offset := (page - 1) * pageSize

	query := models.DB.Model(&models.Extphone{})

	if search != "" {
		query = query.Where("div_name LIKE ? OR name LIKE ? OR ext_phone LIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Count(&totalExtentions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count extention phones"})
		return
	}

	totalPages := int((totalExtentions + int64(pageSize) - 1) / int64(pageSize))
	if page > totalPages && totalPages > 0 {
		page = totalPages
	}

	if err := query.Order("div_name").Offset((offset)).Limit(pageSize).Find(&extentions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed fetch data extention"})
		return
	}

	message := ""
	if len(extentions) == 0 {
		message = "No record!"
	}

	startIndex := offset + 1
	endIndex := offset + len(extentions)
	if endIndex > int(totalExtentions) {
		endIndex = int(totalExtentions)
	}

	c.HTML(http.StatusOK, "Extention", gin.H{
		"title":        "Extention Phone",
		"extentions":   extentions,
		"search":       search,
		"currentPage":  page,
		"totalPages":   totalPages,
		"message":      message,
		"totalEntries": totalExtentions,
		"startIndex":   startIndex,
		"endIndex":     endIndex,
	})
}

func GetExtentionPhonePerDivisi(c *gin.Context) {
	var extentions []models.Extphone
	var groupedExtentions = make(map[string][]models.Extphone)

	if err := models.DB.Find(&extentions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch extention data"})
		return
	}

	for _, ext := range extentions {
		groupedExtentions[ext.DivName] = append(groupedExtentions[ext.DivName], ext)
	}

	c.HTML(http.StatusOK, "Extention Phone", gin.H{
		"title":       "Extention Phone",
		"groupedData": groupedExtentions,
	})
}

func Login(c *gin.Context) {
	var input models.User
	var storedUser models.User

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Where("username = ?", input.Username).First(&storedUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if !CheckPassword(storedUser.Password, input.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	session := sessions.Default(c)
	session.Set("username", storedUser.Username)
	if err := session.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Login successful",
		"redirect": "/auth/dashboard",
	})
}

func SessionStatus(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("username")

	if username == nil {
		c.JSON(http.StatusOK, gin.H{"loggedIn": false})
	} else {
		c.JSON(http.StatusOK, gin.H{"loggedIn": true, "username": username})
	}
}

func Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Options(sessions.Options{MaxAge: -1})
	session.Save()

	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func GetStructureOrganization(c *gin.Context) {
	pdfPath := "/files/uploads/struktur.pdf"

	c.HTML(http.StatusOK, "Struktur Organisasi", gin.H{
		"title":   "Struktur Organisasi",
		"PDFPath": pdfPath,
	})
}

func GetDocument(c *gin.Context) {
	bashPath := os.Getenv("FILE_UPLOAD_PATH")

	documentMap := map[string]string{
		"struktur-organisasi": filepath.ToSlash(filepath.Join(bashPath, "struktur_organisasi.pdf")),
		"tata-tertib":         filepath.ToSlash(filepath.Join(bashPath, "tata_tertib.pdf")),
		"departemen-support":  filepath.ToSlash(filepath.Join(bashPath, "departemen_support.pdf")),
		"eskalasi-prosedur":   filepath.ToSlash(filepath.Join(bashPath, "eskalasi_prosedur.pdf")),
		"hsx-faq":             filepath.ToSlash(filepath.Join(bashPath, "hsx_faq.txt")),
	}

	docKey := c.Param("docKey")
	filePath, exists := documentMap[docKey]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Document not found"})
		return
	}

	title := cases.Title(language.Indonesian).String(strings.ReplaceAll(docKey, "-", " "))

	fileExtension := filepath.Ext(filePath)
	var fileContent string
	var IsTextFile bool

	if fileExtension == ".txt" {
		IsTextFile = true

		content, err := os.ReadFile(filePath)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read the file"})
			return
		}

		p := bluemonday.UGCPolicy()
		fileContent = p.Sanitize(string(content))
	}

	fileRelativePath := "/files/uploads/" + filepath.Base(filePath)

	c.HTML(http.StatusOK, "document_template", gin.H{
		"title":       title,
		"PDFPath":     fileRelativePath,
		"FileContent": template.HTML(fileContent),
		"IsTextFile":  IsTextFile,
	})

}

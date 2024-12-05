package models

type Addressbook struct {
	ID        string `json:"id" gorm:"primaryKey;autoIncrement"`
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
	Address   string `json:"address"`
	Email     string `json:"email"`
	Email2    string `json:"email2"`
	Work      string `json:"work"`
	Mobile    string `json:"mobile"`
}

type Escalation struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	PDF     string `json:"pdf"`
	PDFPath string `gorm:"-"`
}

type Extphone struct {
	ID       string `json:"id" gorm:"primaryKey;autoIncrement"`
	DivName  string `json:"div_name"`
	Name     string `json:"name"`
	ExtPhone string `json:"ext_phone"`
}

type DivisionData struct {
	Finance     []Extphone `json:"finance"`
	Operation   []Extphone `json:"operation"`
	Sales       []Extphone `json:"sales"`
	HRD         []Extphone `json:"hrd"`
	Receptionis []Extphone `json:"receptionis"`
	Security    []Extphone `json:"security"`
}

type User struct {
	ID       string `json:"id" gorm:"primaryKey;autoIncrement"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Bankdt struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	Fileupload     string `json:"fileupload"`
	FileUploadPath string `gorm:"-"`
}

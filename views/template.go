package views

import (
	"text/template"

	"github.com/gin-contrib/multitemplate"
)

func LoadTemplates() multitemplate.Renderer {
	tmpl := multitemplate.NewRenderer()

	funcMap := template.FuncMap{
		"add": func(a, b int) int { return a + b },
		"sub": func(a, b int) int { return a - b },
		"until": func(count int) []int {
			var result []int
			for i := 0; i < count; i++ {
				result = append(result, i)
			}
			return result
		},
	}

	tmpl.AddFromFiles("Home", "views/base.html", "views/banner.html")
	tmpl.AddFromFiles("WuCorp1", "views/base.html", "views/wu-corporate1.html")
	tmpl.AddFromFiles("WuCorp2", "views/base.html", "views/wu-corporate2.html")
	tmpl.AddFromFiles("HsxFaq", "views/base.html", "views/hsx-faq.html")
	tmpl.AddFromFiles("Extention Phone", "views/base.html", "views/extention.html")
	tmpl.AddFromFiles("Dashboard", "views/dashboard/dashboard.html")
	tmpl.AddFromFilesFuncs("User Management", funcMap, "views/dashboard/dashboard.html", "views/dashboard/user.html")
	tmpl.AddFromFilesFuncs("Escalation Procedure", funcMap, "views/base.html", "views/escalation.html")
	tmpl.AddFromFilesFuncs("Escalation", funcMap, "views/dashboard/dashboard.html", "views/dashboard/escalation.html")
	tmpl.AddFromFilesFuncs("Extention", funcMap, "views/dashboard/dashboard.html", "views/dashboard/extention.html")
	tmpl.AddFromFilesFuncs("Address-book", funcMap, "views/base.html", "views/address-book.html")
	tmpl.AddFromFilesFuncs("Contact", funcMap, "views/dashboard/dashboard.html", "views/dashboard/contact.html")

	return tmpl
}

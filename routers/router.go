package routers

import (
	"log"
	"nmc/controllers"
	"nmc/middlewares"
	"nmc/views"
	"os"
	"text/template"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte("dDskjsasfasjbchiusdyiFFKJhjdsfDoioajfDKFjHjkiifojafjDSPPPFK"))
	store.Options(sessions.Options{
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   false,
	})
	r.Use(sessions.Sessions("session", store))

	r.Static("/assets", "./assets")
	r.Static("/files/pdfs", "./files/pdfs")

	r.Static("/files/uploads", os.Getenv("FILE_UPLOAD_PATH"))

	r.SetFuncMap(template.FuncMap{
		"add": func(a, b int) int { return a + b },
		"sub": func(a, b int) int { return a - b },
	})

	r.HTMLRender = views.LoadTemplates()

	log.Println("Templates loaded successfully")

	r.GET("/", controllers.HomePage)
	r.GET("/address-book", controllers.GetAddressBook)
	r.GET("/wu-corporate1", controllers.WuCorp1)
	r.GET("/wu-corporate2", controllers.WuCorp2)
	r.GET("/hsx-faq", controllers.HsxFaq)
	r.GET("/escalation-procedure", controllers.GetEscalProcedure)
	r.GET("/extention-phone", controllers.GetExtentionPhonePerDivisi)
	r.GET("/divisions", controllers.GetDivisions)
	r.GET("/session-status", controllers.SessionStatus)
	r.GET("/document/:docKey", controllers.GetDocument)

	auth := r.Group("/auth")
	auth.Use(middlewares.AuthRequired(), middlewares.NoCache())
	auth.GET("/dashboard", controllers.Dashboard)
	auth.GET("/contact", controllers.GetContact)
	auth.GET("/escalation", controllers.GetEscalation)
	auth.GET("/extention", controllers.GetExtentionPhone)
	auth.GET("/bankdata", controllers.GetBankdt)
	auth.GET("/user", controllers.GetUser)

	r.POST("/contact/search", controllers.GetContact)
	r.POST("/extention", controllers.AddExtentionPhone)
	r.POST("/extention/search", controllers.GetExtentionPhone)
	r.POST("/escalation", controllers.AddNewEscalation)
	r.POST("/escalation/search", controllers.GetEscalation)
	r.POST("/escal/search", controllers.GetEscalProcedure)
	r.POST("/contact", controllers.AddContactAddress)
	r.POST("/address-book", controllers.GetAddressBook)
	r.POST("/login", controllers.Login)
	r.POST("/logout", controllers.Logout)
	r.POST("/user", controllers.AddUser)
	r.POST("/user/search", controllers.GetUser)
	r.POST("/bankdata", controllers.AddBankdt)
	r.POST("/bankdata/search", controllers.GetBankdt)

	r.PUT("/contact/:id", controllers.UpdateContactAddress)
	r.PUT("/escalation/:id", controllers.UpdateEscalation)
	r.PUT("/extention/:id", controllers.UpdateExtentionPhone)
	r.PUT("/user/reset-password/:id", controllers.ResetPassword)
	r.PUT("/bankdata/:id", controllers.UpdateBankdt)

	r.DELETE("/contact/:id", controllers.DeleteContactAddress)
	r.DELETE("/escalation/:id", controllers.DeleteEscal)
	r.DELETE("/extention/:id", controllers.DeleteExtPhone)
	r.DELETE("/user/:id", controllers.DeleteUser)
	r.DELETE("/bankdata/:id", controllers.DeleteBankdt)

	return r

}

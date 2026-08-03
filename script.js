response = {
	"report": {
		"start": "1785721000",
		"finish": "1785724000",
		"deliver": "1785725000"
	},
	"network": {
		"name": "El-compusito",
		"domain": "[none]",
		"ip": "192.168.1.15",
		"linkSpeed": "1000Mpbs",
		"ssid": "[none]"
	},
	"storage": {
		"quant": 3,
		"drives": [
			{
				"name": "NVMe Samsung SSD 970",
				"health": "Unidad sin problemas",
				"interface": "NVMe",
				"totalSize": "465,75 GB",
				"type": "SSD",
				"paritions": [
					{
						"letter": "C",
						"size": "464,92 GB"
					}
				]
			},
			{
				"name": "CT500MX500SSD1",
				"health": "Unidad sin problemas",
				"interface": "SATA",
				"totalSize": "468,76 GB",
				"type": "SSD",
				"paritions": [
					{
						"letter": "D",
						"size": "468,76 GB"
					}
				]
			},
			{
				"name": "TOSHIBA DT01ACA100",
				"health": "Unidad sin problemas",
				"interface": "SATA",
				"totalSize": "931,51 GB",
				"type": "Mecánico",
				"paritions": [
					{
						"letter": "E",
						"size": "931,51 GB"
					}
				]
			}
		]
	},
	"CPU": {
		"model": "AMD Ryzen 5 8500G w/ Radeon 740M Graphics",
		"architecture": "x64",
		"threads": "12",
		"temp": {
			"min": "40",
			"max": "80"
		}
	},

	"RAM": {
		"size": "16 GB",
		"speed": "6000 MT/s",
		"type": "DDR5",
		"modules": "1"
	},
	"SO": {
		"name": "Windows 11",
		"version": "25H2",
		"build": "26200.6584",
		"Arquitecture": "64 Bits"
	},
	"Software": {
		"installed": [
			{
				"name": "Office",
				"version": "365"
			},
			{
				"name": "Suite de Adobe",
				"version": "2026.12"
			},
			{
				"name": "CorelDraw 2026",
				"version": "27.1.0.2"
			}
		],
		"autoruns": [
			{
				"path": "HKLM\\Currentversion\\Run",
				"executables": ["Everything", "SecurityHealth"]
			},
			{
				"path": "HKLM\\WOW6432Node\\CurrentVersion\\Run",
				"executables": ["Everything", "SecurityHealth"]
			}
		]
	},
	"GPU": "AMD Radeon 740M Graphics"
}
window.addEventListener("load", (event)=> { 
    tituloPrincipal = document.getElementById("titulo")
    console.log(response)
    console.log(tituloPrincipal)
})
/*Poner cada elemento en un input
incluir los elementos en html por medio de input
los atributos de input son type, placeholder y value

*/
const builder = require("electron-builder")
const path = require('path')
const Platform = builder.Platform
outputPath = path.join(__dirname,'app_dist');
const options = {
    targets: Platform.MAC.createTarget(),
    // targets: Platform.WINDOWS.createTarget(),
    projectDir:path.join(__dirname),
    config: {
      productName:"mediasoup-demo",
      appId: "**",
      extraFiles: [
      ],
      directories: {
        output: outputPath,
      },
      publish: [
      ],
      asar: false,
      win: {
        target: "nsis",
        artifactName: "${productName}_setup_${version}.${ext}",
        icon:path.join(__dirname,'favicon.ico')
      },
      mac: {
        "icon": "build/icons/icon.icns",
        "artifactName": "${productName}_setup_${version}.${ext}"
      },
      dmg: {
        contents: [
          {
            "x": 410,
            "y": 150,
            "type": "link",
            "path": "/Applications"
          },
          {
            "x": 130,
            "y": 150,
            "type": "file"
          }
        ],
      },
      nsis: {
        oneClick: false,//一键安装
        perMachine: true,
        allowElevation: true,
        displayLanguageSelector: true, //显示选择语言
        installerLanguages: ["zh_CN"],
        license: path.join(__dirname, 'LICENSE.txt'),
        allowToChangeInstallationDirectory: true,//允许选择目录
        createDesktopShortcut: true,//创建桌面快捷方式
        runAfterFinish: false,//安装完是否直接运行
        installerIcon: path.join(__dirname,'favicon.ico'),//安装图标
        uninstallerIcon: path.join(__dirname,'favicon.ico')//卸载图标
      },
      electronDownload: {
        mirror: "http://npm.taobao.org/mirrors/electron/"
      }
    }
  }
// Promise is returned
builder.build(options)
  .then(() => {
    console.log(`打包已经OK: 打包目录为 ${outputPath}\n`)
  })
  .catch((error) => {
    console.log(error)
  })
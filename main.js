const { app, BrowserWindow } = require('electron')
const { run } = require('./server/server')
const {runServer} = require('./demo_server')
const {clientServer} = require('./client_server')

run();
runServer();
clientServer();

function createWindow () {
  // const client_win = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     contextIsolation: false
  //   }
  // })

  
  const demo_win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  // client_win.loadURL(`http://localhost:${7201}`)
  demo_win.loadURL(`http://localhost:${7200}`)
  // client_win.loadURL(`http://localhost:${4601}`)
  // demo_win.loadURL(`http://localhost:${4600}`)
  // client_win.webContents.openDevTools();
  demo_win.webContents.openDevTools();
}
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost')
app.commandLine.appendSwitch('ignore-urlfetcher-cert-requests')
app.commandLine.appendSwitch('allow-running-insecure-content')
// app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
//       event.preventDefault()
//       callback(true)
// });
app.whenReady().then(() => {
  createWindow()

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
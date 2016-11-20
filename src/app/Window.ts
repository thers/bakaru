import * as electron from 'electron';
import icon from './icon';

export default class WindowController {
  public runningDevMode: boolean;

  protected app: Electron.App;
  protected name: string;
  protected rootDir: string;
  protected electron: Electron.ElectronMainAndRenderer;
  protected mainWindowUrl: string;
  protected mainWindow: Electron.BrowserWindow;
  protected mainWindowOptions: Electron.BrowserWindowOptions;

  constructor() {
    this.name = 'Bakaru';

    this.electron = electron;
    this.app = electron.app;
    this.app.setName(this.name);

    this._singleInstance();

    this.rootDir = __dirname;

    this.mainWindowUrl = `file://${this.rootDir}/../src/gui/index.html`;
    this.mainWindow = null;
    this.mainWindowOptions = {
      width: 1280,
      height: 720,
      title: this.name,
      frame: false,
      icon: this.electron.nativeImage.createFromDataURL(icon),
      webPreferences: {
        experimentalFeatures: true,
        blinkFeatures: 'CSSBackdropFilter'
      }
    };

    this._setupAppEventListeners();
  }

  /**
   * @private
   * @returns {*}
   */
  makeSingleInstance() {
    return this.app.makeSingleInstance(() => {
      if (this.mainWindow) {
        if (this.mainWindow.isMinimized()) {
          this.mainWindow.restore();
        }

        this.mainWindow.focus();
      }
    });
  }

  /**
   * Creates main window
   * @private
   */
  createMainWindow() {
    this.mainWindow = new this.electron.BrowserWindow();

    // const wcjsPath = encodeURIComponent(this.server.paths.wcjs);
    const wcjsPath = null;

    this.mainWindow.loadURL(`${global.bakaru.paths.mainWindowUrl}&wcjsPath=${wcjsPath}`);

    if (this.runningDevMode) {
      this.mainWindow.webContents.openDevTools({
        mode: "detach"
      });
    }

    this.mainWindow.on('focus', () => {
      this.mainWindow.flashFrame(false);
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  /**
   * Makes sure Bakaru running single instance
   *
   * @private
   */
  _singleInstance() {
    this.makeSingleInstance() && this.app.quit();
  }

  /**
   * Setup app events listeners
   *
   * @private
   */
  _setupAppEventListeners() {
    this.app.on('ready', () => {
      this.createMainWindow();
    });

    this.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.app.quit();
      }
    });

    this.app.on('activate', () => {
      if (this.mainWindow === null) {
        this.createMainWindow();
      }
    });
  }
}

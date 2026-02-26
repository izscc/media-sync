import {
	App,
	Editor,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	MarkdownView,
	TFile,
	TFolder,
} from "obsidian";
import {
	DEFAULT_SETTINGS,
	MediaSyncSettings,
	SaveDirectory,
	saveFiles,
} from "src/modules";

export default class MediaSyncPlugin extends Plugin {
	settings: MediaSyncSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("leaf", "Media sync", (evt: MouseEvent) => {
			saveFiles(this.app, this, this.settings);
		});

		this.addSettingTab(new MediaSyncSettingTab(this.app, this));
		this.addCommand({
			id: 'media-sync-now',
			name: 'Sync This File',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				
				saveFiles(this.app, this, this.settings, [view.file as TFile], false);
			}
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Media sync").onClick(async () => {
						if (file instanceof TFolder) {
							new Notice("Media sync does not support folders.");
							return;
						}

						saveFiles(this.app, this, this.settings, [file as TFile], false);
					});
				});
			})
		);
	}

	onunload() {}

	async loadSettings() {
		let data: any;

		try {
			data = await this.loadData();
		} catch (error) {
			console.error("load data error");
			console.error(error);
		}

		try {
			const loadData = JSON.parse(data);

			if (loadData.setting) {
				if (!this.settings?.setting) {
					this.settings = DEFAULT_SETTINGS;
				}
				this.settings.setting = loadData.setting;
			} else {
				this.settings = DEFAULT_SETTINGS;
				console.log(this.settings);
			}
		} catch (error) {
			this.settings = DEFAULT_SETTINGS;
			console.error("parse data error");
			console.error(error);
		}
	}
}

class MediaSyncSettingTab extends PluginSettingTab {
	plugin: MediaSyncPlugin;

	constructor(app: App, plugin: MediaSyncPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("媒体文件存储位置")
			.setDesc("指定媒体文件的存储文件夹。")
			.addDropdown((dropdown) => {
				dropdown
					.addOption(SaveDirectory.Default, "默认")
					.addOption(
						SaveDirectory.AttachmentFolderPath,
						"Obsidian 附件文件夹"
					)
					.addOption(SaveDirectory.UserDefined, "自定义文件夹")
					.setValue(this.plugin.settings.setting.saveDirectory)
					.onChange(async (value) => {
						this.plugin.settings.setting.saveDirectory = value;
						await this.saveSettings();

						if (value === SaveDirectory.UserDefined) {
							customFolderSetting.setDisabled(false);
						} else {
							customFolderSetting.setDisabled(true);
							const input =
								customFolderSetting.settingEl.querySelector("input");
							if (input) {
								input.value = "";
								this.plugin.settings.setting.resourceFolderName = "";
								await this.saveSettings();
							}
						}
					});
			});

		const customFolderSetting = new Setting(containerEl)
			.setName("自定义文件夹名称")
			.setDesc("指定媒体文件存储的文件夹名称。")
			.addText((text) => {
				text
					.setPlaceholder("自定义文件夹名称")
					.setValue(this.plugin.settings.setting.resourceFolderName)
					.onChange(async (value) => {
						this.plugin.settings.setting.resourceFolderName = value;
						await this.saveSettings();
					})
					.setDisabled(true);
			});

		new Setting(containerEl)
			.setName("自定义扫描路径")
			.setDesc(
				"仅扫描这些文件夹中的 Markdown 文件（每行一个路径）。留空则扫描所有文件夹。设置后，排除文件夹设置将被忽略。"
			)
			.addTextArea((text) => {
				text
					.setPlaceholder("文件夹1/子文件夹\n文件夹2")
					.setValue(this.plugin.settings.setting.includeFolders)
					.onChange(async (value) => {
						this.plugin.settings.setting.includeFolders = value;
						await this.saveSettings();
					});
				text.inputEl.rows = 4;
				text.inputEl.cols = 30;
			});

		new Setting(containerEl)
			.setName("排除文件夹")
			.setDesc(
				"跳过这些文件夹中的 Markdown 文件（每行一个路径）。设置了自定义扫描路径时，此项将被忽略。"
			)
			.addTextArea((text) => {
				text
					.setPlaceholder("文件夹1/子文件夹\n文件夹2")
					.setValue(this.plugin.settings.setting.excludeFolders)
					.onChange(async (value) => {
						this.plugin.settings.setting.excludeFolders = value;
						await this.saveSettings();
					});
				text.inputEl.rows = 4;
				text.inputEl.cols = 30;
			});
	}

	async saveSettings() {
		try {
			let data: any;
			try {
				data = await this.plugin.loadData();
			} catch (error) {
				console.error("load data error");
				console.error(error);
			}

			let saveData: any;
			if (data) {
				saveData = JSON.stringify({
					...JSON.parse(data),
					...this.plugin.settings,
				});
			} else {
				saveData = JSON.stringify({
					...this.plugin.settings,
				});
			}

			await this.plugin.saveData(saveData);
		} catch (error) {
			console.error("save data error");
			console.error(error);
		}
	}
}

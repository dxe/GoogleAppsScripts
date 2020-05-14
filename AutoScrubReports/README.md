
# AutoScrubReports

AutoScrubReports is a Google Apps Script that removes access to files in a designated folder in your Google Drive after they reach a particular age. For each of these files, the following is done:

 1. Any users who have been explicitly granted access to view, edit, or comment on the file have their access removed.
 2. The file sharing permissions are set to *private*. If the file was previously configured to be accessible to anyone with the link, that link will no longer grant access.
 3. The file is moved to the trash. **It will remain possible to restore the file until you [manually delete the file or empty your trash](https://support.google.com/drive/answer/2375102) in Google Drive.**

## Installation

To configure the script, you will need the folder ID. To get the target folder ID, open the target folder in Google Drive and copy the last part of the URL path.

 1. Clone the repository to your machine.
 2. Copy the contents of the [Code.gs](./Code.gs) file to your clipboard.
 3. Open the [Google Apps Script dashboard](https://script.google.com/home).
 4. Click the *New project* button. An editor will open in a new tab.
 5. Clear the contents of the editor and paste the contents of Code<span/>.gs.
 6. Click on the Save icon or press Ctrl+S.
 7. Enter the project name "AutoScrubReports" when prompted and click OK to save.
 8. To add the configuration, click on *File* in the editor menu bar and select *Project Properties*.
 9. Click on the *Script properties* tab and add the following properties:

  | Property           | Value                                           |
  |--------------------|-------------------------------------------------|
  | TARGET_FOLDER_ID   | [The ID you obtained from the Google Drive URL] |
  | AFTER_DAYS_ELAPSED | [Number of days]                                |
 10. Click on the *Select function* dropdown in the editor toolbar.
     - If you want to add the script as a daily trigger, select the *createDailyTrigger* option.
     - If you only want to run the script once, select *main*.
 11. Click the ▶ button to run the selected function.
 12. To verify that the trigger has been added, click *Edit* in the editor menu bar and select *Current project's triggers*. 

## Uninstallation

 1. Go to the [My Triggers](https://script.google.com/home/triggers) page on the Google Apps Script dashboard.
 2. Find the AutoScrubReports entry and click the kebab icon (three dots aligned vertically) on the right-hand side.
 3. Select *Delete trigger* and press *DELETE FOREVER* to confirm.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)


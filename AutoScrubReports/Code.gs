/**
 * In order for the `main` function in this script to succeed, you will need to
 * specify the target folder ID and the number of days after which to delete
 * files. To get the target folder ID, open the target folder in Google Drive
 * and copy the last part of the URL path.
 *
 * Select File > Project Properties in the Google Apps Script editor. Click on
 * the "Script properties" tab and add the following properties:
 *
 * Property: TARGET_FOLDER_ID
 * Value: [The ID you obtained in the previous step]
 *
 * Property: AFTER_DAYS_ELAPSED
 * Value: [Number of days]
 */

/* Create a trigger that runs the `main` function every day between 12-1am
 */
function createDailyTrigger() {
  ScriptApp.newTrigger('main')
      .timeBased()
      .everyDays(1)
      .create();
}

function main() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const targetFolderId = scriptProperties.getProperty('TARGET_FOLDER_ID');
  const afterDaysElapsed = scriptProperties.getProperty('AFTER_DAYS_ELAPSED');

  const oldFiles = getOldFiles(targetFolderId, afterDaysElapsed);
  for (const file of oldFiles) {
    removeAccess(file);
  }
}

/* Remove all editors, commenters, and viewers who are not the owner from the
 * file. Set permissions to only people explicitly added can access. Then, move
 * the file to the trash.
 */
function removeAccess(file) {
  const owner = file.getOwner();
  const editors = file.getEditors();
  const viewers = file.getViewers();

  // Revoke permissions from people who were explicitly added
  editors
      .concat(viewers)
      .filter(user => user !== owner)
      .forEach(user => file.revokePermissions(user));

  // Revoke "anyone with the link" permissions
  file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.NONE);

  // Move to trash (does not delete the file permanently)
  file.setTrashed(true);
  Logger.log("Removed file " + file.getName());
}

/* Generator: Yield all files older than `afterDaysElapsed` days inside the
 * folder specified by `folderId`.
 */
function* getOldFiles(folderId, afterDaysElapsed) {
  const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  const now = new Date();

  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const dateCreated = file.getDateCreated();
    const daysElapsed = (now.getTime() - dateCreated.getTime()) / MILLIS_PER_DAY;
    if (daysElapsed >= afterDaysElapsed) {
      yield file;
    }
  }
}

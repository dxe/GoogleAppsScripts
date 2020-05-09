/* Create a trigger that runs the `main` function every day between 12-1am
 */
function createDailyTrigger() {
  ScriptApp.newTrigger('main')
      .timeBased()
      .everyDays(1)
      .create();
}

function main() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var targetFolderId = scriptProperties.getProperty('TARGET_FOLDER_ID');
  var afterDaysElapsed = scriptProperties.getProperty('AFTER_DAYS_ELAPSED');
  removeOldFiles(targetFolderId, afterDaysElapsed);
}  

/* Remove all files older than `afterDaysElapsed` days inside the folder
 * specified by `folderId`.
 */
function removeOldFiles(folderId, afterDaysElapsed) {
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
  var now = new Date();

  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  while (files.hasNext()) {
    file = files.next();
    var dateCreated = file.getDateCreated();
    var daysElapsed = (now.getTime() - dateCreated.getTime()) / MILLIS_PER_DAY;
    if (daysElapsed >= afterDaysElapsed) {
      file.setTrashed(true);
      Logger.log("Removed file " + file.getName());
    }
  }
}

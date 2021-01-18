const Constants = {
  resultColumnNumber: 'N',
  columnNumbers: {
    firstDataRow: 2,
    firstDataColumn: 1,
    firstName: 1,
    lastName: 2,
    phoneNumber: 3,
    email: 4,
    addToMailingListResult: 14,
  },
  columnNames: {
    firstName: "First Name",
    lastName: "Last Name",
    phoneNumber: "Phone Number ",
    email: "Email",
  },
  sendyCustom: {
    firstName: "FirstName",
    lastName: "LastName",
    phoneNumber: "Phone",
  },
  sendy: {
    apiKey: "",
    list: "",
    referrer: "",
    url: "",
  }
};

function addExistingRowsToSendy() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange(
    Constants.columnNumbers.firstDataRow,
    Constants.columnNumbers.firstDataColumn,
    sheet.getLastRow(),
    Math.max(sheet.getLastColumn(), Constants.columnNumbers.addToMailingListResult),
  ); // Skip first row
  Logger.log(sheet.getLastColumn());
  const values = range.getValues();
  const numRows = range.getNumRows();
  for (let row = 1; row <= numRows; row++) {
    Logger.log(row);
    addToSendy({
      firstName: values[row][Constants.columnNumbers.firstName],
      lastName: values[row][Constants.columnNumbers.lastName],
      phoneNumber: values[row][Constants.columnNumbers.phoneNumber],
      email: values[row][Constants.columnNumbers.email],
      resultCell: range.getCell(row, Constants.columnNumbers.addToMailingListResult),
    });
  }
}

function onFormSubmitAddToSendy({ namedValues, range }) {
  Logger.log("namedValues: ", namedValues);
  Logger.log("range: ", range);
  const resultCell = SpreadsheetApp.getActiveSheet().getRange(`${Constants.resultColumnNumber}${range.rowStart}`);
  addToSendy({
    resultCell,
    firstName: namedValues[Constants.columnNames.firstName][0],
    lastName: namedValues[Constants.columnNames.lastName][0],
    phoneNumber: namedValues[Constants.columnNames.phoneNumber][0],
    email: namedValues[Constants.columnNames.email][0],
  });
}

// Sendy API description: https://sendy.co/api
function addToSendy({ firstName, lastName, phoneNumber, email, resultCell }) {
  Logger.log("addToSendy called with params: ", { firstName, lastName, phoneNumber, email, resultCell });
  if (resultCell.getValue() !== "") {
    Logger.log("resultCell not empty; will do nothing");
    return;
  }
  const params = {
    method: "post",
    payload: {
      /* Sendy settings */
      api_key: Constants.sendy.apiKey,
      list: Constants.sendy.list,
      // Referrer value is the Google Form link 
      referrer: Constants.sendy.referrer,
      boolean: true, // Get a plain text response

      /* Default Sendy fields */
      name: `${firstName} ${lastName}`,
      email: email,
      /* Custom fields */
      [Constants.sendyCustom.firstName]: firstName,
      [Constants.sendyCustom.lastName]: lastName,
      [Constants.sendyCustom.phoneNumber]: phoneNumber,
    },
  }
  Logger.log("sendyApiCall params: ", params)
  try {
    const response = UrlFetchApp.fetch(Constants.sendy.url, params);
    Logger.log("response.getResponseCode(): ", response.getResponseCode());
    const responseText = response.getContentText();
    Logger.log("response.getContentText(): ", responseText);
    if (responseText === "1") { // "1" is returned for successes
      resultCell.setValue("Successfully added to Sendy");
    } else {
      resultCell.setValue(`Failed to add to Sendy: ${responseText}`);
    }
  } catch (error) {
    resultCell.setValue(`Failed to add to Sendy: ${error}`);
  }
}

const startingRow = 2; // 2 because getRange is 1-based + number of frozen rows (1)
const sendToSignUpServiceColLetter = 'N';
const columnNumbers = {
  firstName: 1,
  lastName: 2,
  phone: 3,
  email: 4,
};
const apiData = {
  apiKey: "redacted",
  url: "redacted",
  source: "redacted",
};

function sendExistingRowsToSignupService() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange(startingRow, 1, sheet.getLastRow(), sheet.getLastColumn());
  const values = range.getValues();
  const numRows = range.getNumRows();
  for (let row = 0; row < numRows - 1; row++) { // numRows - 1 because sheet.getLastRow() is 1-based
    sendToSignUpService({
      firstName: values[row][columnNumbers.firstName],
      lastName: values[row][columnNumbers.lastName],
      phone: values[row][columnNumbers.phone],
      email: values[row][columnNumbers.email],
      resultCell: range.getCell(
        row + 1, // + 1 because getCell is 1-based
        7,
      ),
    });
  }
}

function onFormSubmitSendToSignupService({ namedValues, range }) {
  const resultCell = SpreadsheetApp.getActiveSheet().getRange(`${sendToSignUpServiceColLetter}${range.rowStart}`);
  onFormSubmitSendToSignupService({
    resultCell,
    firstName: namedValues["First Name"][0],
    lastName: namedValues["Last Name"][0],
    phone: namedValues["Phone Number "][0],
    email: namedValues["Email"][0],
  });
}

function sendToSignUpService({ firstName, lastName, phone, email, resultCell }) {
  if (resultCell.getValue() !== "") {
    console.log("resultCell not empty; will do nothing");
    return;
  }
  const params = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Content-Type": "application/json",
      "X-api-key": apiData.apiKey,
    },
    payload: {
      source: apiData.source,
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
    },
  }
  try {
    const response = UrlFetchApp.fetch(apiData.url, params);
    const responseCode = response.getResponseCode();
    console.log("response.getResponseCode(): ", response.getResponseCode());
    resultCell.setValue(`Signup successful - responseCode: ${responseCode}`);
  } catch (error) {
    console.log(`Failed to sign up: ${error}`);
    resultCell.setValue(`Failed to sign up: ${error}`);
  }
}

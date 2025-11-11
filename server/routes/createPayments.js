const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/api/createPayments", async (req, res) => {
  const { paymentDate, paymentsReceived } = req.body;

  // SQL to batch update collateral_balance table to change the end_date of the previous balances to the payment date
  const updateSQL = `

WITH latest AS (
  SELECT DISTINCT ON (collateral_id)
    collateral_balance_id,
    collateral_id
  FROM collateral_balance
  ORDER BY collateral_id, start_date DESC
)
UPDATE collateral_balance c
SET end_date = $1
FROM latest l
WHERE c.collateral_balance_id = l.collateral_balance_id
  AND c.collateral_id = ANY($2)
`;

  // Variable to hold all collateral ids that are being updated
  var collateralIdArray = [];

  // array to hold the parameters that will be inserted into payments
  var insertValues = [];

  // array to hold the parameters that will be inserted into balances
  var insertBalances = [];

  // Beginning of SQL to batch insert into payments table for all of the new payments
  var insertSQL =
    "INSERT INTO payments (payment_date, collateral_id, principal_received, interest_received) VALUES ";

  // Beginning of SQL to batch insert into collateral balance table for the new balances
  var insertBalanceSQL =
    "INSERT INTO collateral_balance (start_date, collateral_id, outstanding_amount, commitment_amount) VALUES ";

  // loop to build the ending of the SQLs for batch inserts
  for (let i = 1; i <= paymentsReceived.length * 4; i++) {
    if (i % 4 === 1) {
      insertSQL = insertSQL + "(";
      insertBalanceSQL = insertBalanceSQL + "(";
    }
    insertSQL = insertSQL + "$" + i;
    insertBalanceSQL = insertBalanceSQL + "$" + i;
    if (i % 4 !== 0) {
      insertSQL = insertSQL + ",";
      insertBalanceSQL = insertBalanceSQL + ",";
    } else {
      if (i !== paymentsReceived.length * 4) {
        insertBalanceSQL = insertBalanceSQL + "),";
        insertSQL = insertSQL + "),";
      } else {
        insertBalanceSQL = insertBalanceSQL + ");";
        insertSQL = insertSQL + ");";
      }
    }
  }

  // loop to populate the array with the parameters that will be inserted into payments
  for (let i = 0; i < paymentsReceived.length; i++) {
    insertValues.push(paymentDate);
    insertValues.push(paymentsReceived[i].collateralId);
    insertValues.push(paymentsReceived[i].principalReceived || 0);
    insertValues.push(paymentsReceived[i].interestReceived || 0);
  }

  // loop to populate the array with the parameters that will be inserted into balances
  for (let i = 0; i < paymentsReceived.length; i++) {
    insertBalances.push(paymentDate);
    insertBalances.push(paymentsReceived[i].collateralId);
    insertBalances.push(paymentsReceived[i].outstanding);
    insertBalances.push(paymentsReceived[i].commitment);
  }

  // loop to populate collateralIdArray with collateral ids
  for (let i = 0; i < paymentsReceived.length; i++) {
    collateralIdArray.push(paymentsReceived[i].collateralId);
  }

  try {
    await pool.query(updateSQL, [paymentDate, collateralIdArray]);
    await pool.query(insertBalanceSQL, insertBalances);
    await pool.query(insertSQL, insertValues);

    res.sendStatus(201);
  } catch {
    res.status(500).send("Creating payment records in database failed");
  }
});

module.exports = router;

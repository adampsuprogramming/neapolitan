const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const { conditionalAuth } = require("./middleware/auth");
const borrowBaseRoutes = require("./routes/borrowBase");
const facilityRoutes = require("./routes/facilityQuery");
const lenderQueryRoutes = require("./routes/lenderQuery");
const portfolioQueryRoutes = require("./routes/portfolioQuery");
const createDebtFacilityRoutes = require("./routes/createDebtFacility");
const subsectorQueryRoutes = require("./routes/subsectorQuery");
const regionQueryRoutes = require("./routes/regionQuery");
const createBorrowerRoutes = require("./routes/createBorrower");
const borrowerQueryRoutes = require("./routes/borrowerQuery");
const createLoanAgreementRoutes = require("./routes/createLoanAgreement");
const loanAgreementQueryRoutes = require("./routes/loanAgreementQuery");
const createLoanTrancheRoutes = require("./routes/createLoanTranche");
const loanTrancheQuery = require("./routes/loanTrancheQuery");
const createLoanApproval = require("./routes/createLoanApproval");
const loanApprovalQuery = require("./routes/loanApprovalQuery");
const createCollateral = require("./routes/createCollateral");
const rateDataQuery = require("./routes/rateDataQuery");
const createRateChange = require("./routes/createRateChange");
const metricsQuery = require("./routes/metricsQuery");
const createMetricsChange = require("./routes/createMetricsChange");
const createPayments = require("./routes/createPayments");
const reportingCalculations = require("./routes/reportingCalculations");
const paymentsQuery = require("./routes/paymentsQuery");
const bankMetricsQuery = require("./routes/bankMetricsQuery");
const createBankMetricsChange = require("./routes/createBankMetricsChange");
const borrowerQueryByFacility = require("./routes/borrowerQueryByFacility");
const pieChartCalculations = require("./routes/pieChartCalculations");

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
  res.end();
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use(conditionalAuth);

// Route to retrieve borrowing base
app.use(borrowBaseRoutes);
app.use(facilityRoutes);
app.use(lenderQueryRoutes);
app.use(portfolioQueryRoutes);
app.use(createDebtFacilityRoutes);
app.use(subsectorQueryRoutes);
app.use(regionQueryRoutes);
app.use(createBorrowerRoutes);
app.use(borrowerQueryRoutes);
app.use(createLoanAgreementRoutes);
app.use(loanAgreementQueryRoutes);
app.use(createLoanTrancheRoutes);
app.use(loanTrancheQuery);
app.use(createLoanApproval);
app.use(loanApprovalQuery);
app.use(createCollateral);
app.use(rateDataQuery);
app.use(createRateChange);
app.use(metricsQuery);
app.use(createMetricsChange);
app.use(createPayments);
app.use(reportingCalculations);
app.use(paymentsQuery);
app.use(bankMetricsQuery);
app.use(createBankMetricsChange);
app.use(borrowerQueryByFacility);
app.use(pieChartCalculations);

module.exports = app;

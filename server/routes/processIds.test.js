// ************************************************************************
// *       UT-88 – test getIdsOfAdditions(facilityCollateral)             *
// *       UT-89 - test getIdsOfRemoved(facilityCollateral)
// *       UT-90 - test getIdsAtStartOfPeriod(facilityCollateral, startDateObject)
// *       UT-91 - test getIdsAtEndOfPeriod(facilityCollateral, endDateObject)
// *       UT-92 - test getEveryIdInPeriod(facilityCollateral, startDateObject, endDateObject)
// ************************************************************************

const {
  getIdsOfAdditions,
  getIdsOfRemoved,
  getIdsAtStartOfPeriod,
  getIdsAtEndOfPeriod,
  getEveryIdInPeriod,
} = require("../routes/processIds");




describe("test processIds", () => {

// ********************** UT-88 – test getIdsOfAdditions(facilityCollateral) ***************************

  it("accepts a facilityCollateral object and returns ids of additions", async () => {

    const facilityCollateral = ({rows: [
      {
        inclusion_date: new Date("2025-02-27T00:00:00"),
        removed_date: new Date("2025-08-15T00:00:00"),
        collateral_id: 150,
        tranche_id: 236,
        loan_approval_id: 147,
      },
      {
        inclusion_date: new Date("2025-07-14T00:00:00"),
        removed_date: null,
        collateral_id: 153,
        tranche_id: 239,
        loan_approval_id: 150,
      },]})
      
    const result = getIdsOfAdditions(facilityCollateral);

    expect(result).toEqual([
      { id: 150, addedDate: new Date("2025-02-27T00:00:00") },
      { id: 153, addedDate: new Date("2025-07-14T00:00:00") },
    ]);

  });



// ********************** UT-89 - test getIdsOfRemoved(facilityCollateral) ***************************

  it("accepts a facilityCollateral object and returns ids of removed collateral", async () => {

    const facilityCollateral = ({rows: [
      {
        inclusion_date: new Date("2025-02-27T00:00:00"),
        removed_date: new Date("2025-08-15T00:00:00"),
        collateral_id: 150,
        tranche_id: 236,
        loan_approval_id: 147,
      },
      {
        inclusion_date: new Date("2025-07-14T00:00:00"),
        removed_date: null,
        collateral_id: 153,
        tranche_id: 239,
        loan_approval_id: 150,
      },]})
      
    const result = getIdsOfRemoved(facilityCollateral);

    expect(result).toEqual([{ id: 150, removalDate: new Date("2025-08-15T00:00:00") }]);

  });

// ********************** UT-90 - test getIdsAtStartOfPeriod(facilityCollateral, startDateObject) ***************************

  it("accepts a facilityCollateral object and startDateObject, returning ids of start-of-period collateral", async () => {

    const facilityCollateral = ({rows: [
      {
        inclusion_date: new Date("2025-02-27T00:00:00"),
        removed_date: new Date("2025-08-15T00:00:00"),
        collateral_id: 150,
        tranche_id: 236,
        loan_approval_id: 147,
      },
      {
        inclusion_date: new Date("2025-07-14T00:00:00"),
        removed_date: null,
        collateral_id: 153,
        tranche_id: 239,
        loan_approval_id: 150,
      },]})

    const startDateObject=new Date("2025-05-01T00:00:00");
      
    const result = getIdsAtStartOfPeriod(facilityCollateral, startDateObject);

    expect(result).toEqual([150]);

  });

// ********************** UT-91 - test getIdsAtEndOfPeriod(facilityCollateral, endDateObject) ***************************

  it("accepts a facilityCollateral object and endDateObject, returning ids of end-of-period collateral", async () => {

    const facilityCollateral = ({rows: [
      {
        inclusion_date: new Date("2025-02-27T00:00:00"),
        removed_date: new Date("2025-08-15T00:00:00"),
        collateral_id: 150,
        tranche_id: 236,
        loan_approval_id: 147,
      },
      {
        inclusion_date: new Date("2025-07-14T00:00:00"),
        removed_date: null,
        collateral_id: 153,
        tranche_id: 239,
        loan_approval_id: 150,
      },]})

    const endDateObject=new Date("2025-10-31T00:00:00");
      
    const result = getIdsAtEndOfPeriod(facilityCollateral, endDateObject);

    expect(result).toEqual([{ collateralId: 153, removedDate: null }]);

  });

  
// ********************** UT-92 - test getEveryIdInPeriod(facilityCollateral, startDateObject, endDateObject) ***************************

  it("accepts a facilityCollateral object, startDaetObject, and endDateObject, returning ids of every collateral in period", async () => {

    const facilityCollateral = ({rows: [
      {
        inclusion_date: new Date("2025-02-27T00:00:00"),
        removed_date: new Date("2025-08-15T00:00:00"),
        collateral_id: 150,
        tranche_id: 236,
        loan_approval_id: 147,
      },
      {
        inclusion_date: new Date("2025-07-14T00:00:00"),
        removed_date: null,
        collateral_id: 153,
        tranche_id: 239,
        loan_approval_id: 150,
      },]})

    const startDateObject=new Date("2025-05-01T00:00:00");
    const endDateObject=new Date("2025-10-31T00:00:00");
      
    const result = getEveryIdInPeriod(facilityCollateral, startDateObject, endDateObject);

    expect(result).toEqual([{ id: 150 }, { id: 153 }]);

  });

});

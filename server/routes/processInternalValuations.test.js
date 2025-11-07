// ***************************************************************************************************************
//                        UT-107 – function getBegAndEndInternalValuations()                                     *
//                        UT-108 – function getBegAndEndInternalValuations() - Null Start                        *
//                        UT-109 – function getBegAndEndInternalValuations() - Null End                          *
// ***************************************************************************************************************

const { getBegAndEndInternalValuations } = require("../routes/processInternalValuations");
const rollforwardQueries = require("../routes/rollforwardQueries");
jest.mock("../routes/rollforwardQueries");

describe("test processBankValuations", () => {
  // ********************** UT-107 – function getBegAndEndInternalValuations() - ***************************

  it("accepts multiple parameters returns beginning and ending internal valuations for each collateral in facility for time period", async () => {
    rollforwardQueries.getIntValForCollateral.mockResolvedValueOnce({
      rows: [
        {
          collateral_id: 153,
          start_date: new Date("2025-07-14T00:00:00"),
          end_date: new Date("2025-12-31T00:00:00"),
          internal_val: 0.95,
        },
      ],
    });

    const allIdsStart = [150];
    const allIdsEnd = [{ collateralId: 153, removedDate: null }];
    const additions = [
      {
        collateralId: 153,
        addedDate: new Date("2025-07-14T00:00:00"),
        amtAdded: 15000000,
      },
    ];
    const intValStart = {
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          internal_val: 1,
        },
      ],
    };
    const intValEnd = {
      rows: [
        {
          collateral_id: 153,
          start_date: new Date("2025-07-15T00:00:00"),
          end_date: new Date("2025-12-31T00:00:00"),
          internal_val: 0.98,
        },
      ],
    };

    const result = await getBegAndEndInternalValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      intValStart,
      intValEnd,
    );

    expect(result).toEqual([
      {
        collateralId: 150,
        internalValBeg: 1,
        internalValEnd: null,
      },
      {
        collateralId: 153,
        internalValBeg: 0.95,
        internalValEnd: 0.98,
      },
    ]);
  });

  // ********************** UT-108 – function getBegAndEndInternalValuations() - NULL START ***************************
  it("accepts multiple parameters returns beginning and ending internal valuations for each collateral in facility for time period - no starting info for record", async () => {
    const allIdsStart = [150];
    const allIdsEnd = [{ collateralId: 150, removedDate: null }];
    const additions = [];
    const intValStart = {
      rows: [],
    };
    const intValEnd = {
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-07-15T00:00:00"),
          end_date: new Date("2025-12-31T00:00:00"),
          internal_val: 0.98,
        },
      ],
    };

    const result = await getBegAndEndInternalValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      intValStart,
      intValEnd,
    );

    expect(result).toEqual([
      {
        collateralId: 150,
        internalValBeg: null,
        internalValEnd: 0.98,
      },
    ]);
  });

  // ********************** UT-109 – function getBegAndEndInternalValuations() - No ending info for record  ***************************
  it("accepts multiple parameters returns beginning and ending internal valuations for each collateral in facility for time period", async () => {
    const allIdsStart = [150];
    const allIdsEnd = [{ collateralId: 150, removedDate: null }];
    const additions = [];
    const intValStart = {
      rows: [
        {
          collateral_id: 150,
          start_date: new Date("2025-02-27T00:00:00"),
          end_date: new Date("2025-08-15T00:00:00"),
          internal_val: 1,
        },
      ],
    };
    const intValEnd = {
      rows: [],
    };

    const result = await getBegAndEndInternalValuations(
      allIdsStart,
      allIdsEnd,
      additions,
      intValStart,
      intValEnd,
    );

    expect(result).toEqual([
      {
        collateralId: 150,
        internalValBeg: 1,
        internalValEnd: null,
      },
    ]);
  });
});

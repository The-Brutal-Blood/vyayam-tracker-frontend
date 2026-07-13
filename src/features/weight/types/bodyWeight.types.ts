/** POST /body-weight payload — one daily body-weight entry (kilograms). */
export interface LogBodyWeightRequest {
  weight: number;
}

/** One logged point in the weight history. */
export interface BodyWeightEntry {
  /** Calendar date, "YYYY-MM-DD". */
  date: string;
  weight: number;
}

/** Today's logging status within the GET /body-weight response. */
export interface BodyWeightToday {
  weight: number | null;
  alreadyLogged: boolean;
  loggedDate: string | null;
}

/** GET /body-weight — the Weight Tracker summary (stats pre-computed by API). */
export interface BodyWeightSummary {
  today: BodyWeightToday;
  currentWeight: number | null;
  startingWeight: number | null;
  weightChange: number;
  lowestWeight: number | null;
  highestWeight: number | null;
  totalEntries: number;
  entries: BodyWeightEntry[];
}

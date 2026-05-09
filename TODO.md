# TODO

## Task: Prevent daily billable hours from exceeding remaining project hours

- [ ] Fix `validateDailyEntry` / usage exclusion logic in `Frontend/src/context/AppContext.jsx` so edits never bypass remaining-hour constraints.
- [ ] Ensure month key used for remaining calculation matches the daily entry’s real month name.
- [ ] (Optional UX) keep/tighten validation in `Frontend/src/components/DailyTable.jsx` so UI also blocks overshoot consistently.
- [ ] Run frontend typecheck/lint/build or dev sanity check.

